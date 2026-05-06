-- PulmoVerde RAG vector store
-- Run once on the Supabase SQL editor.
--
-- Architecture: Chroma-style retrieval (embedding + cosine similarity +
-- top-K) with Supabase as the backing store. Embeddings are stored as
-- JSONB arrays (float[]). Similarity is computed in-process by the
-- Next.js API route — fine up to ~5k documents. To scale further,
-- enable the pgvector extension and migrate `embedding` to vector(1536).

create table if not exists rag_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text not null default 'general',
  source text,
  embedding jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rag_documents_category_idx on rag_documents(category);
create index if not exists rag_documents_updated_idx on rag_documents(updated_at desc);

-- Allow the anon key to READ (so the chat endpoint works without service role).
-- Writes require service role.
alter table rag_documents enable row level security;

drop policy if exists "rag_documents_read_anon" on rag_documents;
create policy "rag_documents_read_anon" on rag_documents
  for select to anon, authenticated using (true);

-- Optional: chat conversation log (for analytics in admin panel).
create table if not exists chat_conversations (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  question text not null,
  answer text not null,
  sources jsonb,
  tokens_in integer,
  tokens_out integer,
  cost_usd numeric(10,6),
  latency_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists chat_conversations_session_idx on chat_conversations(session_id);
create index if not exists chat_conversations_created_idx on chat_conversations(created_at desc);

alter table chat_conversations enable row level security;
-- Only service role can read / write conversations (admin-only).
