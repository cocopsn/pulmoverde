/**
 * Chroma-style RAG over Supabase.
 *
 * Embeddings (text-embedding-3-small, 1536 dims) live as JSONB float
 * arrays in `rag_documents`. Similarity search is cosine, computed
 * in-process — fine up to ~5k documents on a Vercel serverless function.
 * Past that, swap the storage column for pgvector(1536) and let Postgres
 * do the math.
 */
import { supabaseAdmin } from "./supabase-server";
import { openai, EMBEDDING_MODEL } from "./openai";

export interface RagDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  source: string | null;
  embedding: number[] | null;
  created_at: string;
  updated_at: string;
}

export interface RagHit {
  doc: RagDocument;
  score: number;
}

export async function embed(text: string): Promise<number[]> {
  const resp = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return resp.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const resp = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return resp.data.map((d) => d.embedding);
}

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export async function listDocuments(): Promise<RagDocument[]> {
  const { data, error } = await supabaseAdmin
    .from("rag_documents")
    .select("*")
    .order("category", { ascending: true })
    .order("title", { ascending: true });
  if (error) throw new Error(error.message);
  return (data || []) as RagDocument[];
}

export async function getDocument(id: string): Promise<RagDocument | null> {
  const { data, error } = await supabaseAdmin
    .from("rag_documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as RagDocument) || null;
}

export async function upsertDocument(input: {
  id?: string;
  title: string;
  content: string;
  category: string;
  source?: string | null;
}): Promise<RagDocument> {
  const embedding = await embed(`${input.title}\n\n${input.content}`);
  const row = {
    id: input.id,
    title: input.title,
    content: input.content,
    category: input.category,
    source: input.source ?? null,
    embedding,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabaseAdmin
    .from("rag_documents")
    .upsert(row, { onConflict: "id" })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as RagDocument;
}

export async function deleteDocument(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("rag_documents")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function search(
  query: string,
  topK = 5,
  minScore = 0.2,
): Promise<RagHit[]> {
  const queryEmbedding = await embed(query);
  const docs = await listDocuments();
  const scored: RagHit[] = docs
    .filter((d) => Array.isArray(d.embedding) && d.embedding.length > 0)
    .map((doc) => ({ doc, score: cosine(queryEmbedding, doc.embedding!) }))
    .filter((h) => h.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  return scored;
}

/**
 * Re-embed every document. Use after a model change or as a maintenance
 * sweep. Returns the count.
 */
export async function reindexAll(): Promise<number> {
  const docs = await listDocuments();
  if (docs.length === 0) return 0;
  // Batch in groups of 50 to be friendly to the API.
  const batchSize = 50;
  let processed = 0;
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    const embeddings = await embedBatch(
      batch.map((d) => `${d.title}\n\n${d.content}`),
    );
    const updates = batch.map((d, j) => ({
      id: d.id,
      title: d.title,
      content: d.content,
      category: d.category,
      source: d.source,
      embedding: embeddings[j],
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabaseAdmin
      .from("rag_documents")
      .upsert(updates, { onConflict: "id" });
    if (error) throw new Error(error.message);
    processed += batch.length;
  }
  return processed;
}
