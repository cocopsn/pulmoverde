import { NextResponse } from "next/server";
import { getOpenAI, CHAT_MODEL, estimateCost } from "@/lib/openai";
import { search } from "@/lib/rag";
import { supabaseAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `Eres el asistente oficial de PulmoVerde, una plataforma ciudadana de educación ambiental y bienestar animal en Saltillo, Coahuila, México.

Reglas estrictas:
1. Responde SIEMPRE en español neutro de México.
2. Usa SOLO la información del CONTEXTO. Si el contexto no contiene la respuesta, dilo claramente y sugiere consultar el módulo correspondiente del sitio (Ley, Aire, Compromisos) o escribir al CBAM.
3. Sé conciso: 2-4 oraciones máximo, salvo que la pregunta requiera pasos numerados.
4. Cita el número de teléfono o canal de denuncia EXACTO si la pregunta es sobre cómo denunciar.
5. Tono: directo, ciudadano, sin jerga legal innecesaria. Trata al usuario de "tú".
6. Si te preguntan algo fuera del alcance (calidad del aire fuera de Saltillo, leyes de otros estados, política partidista, temas no ambientales), declina educadamente y reorienta.
7. Nunca inventes números de artículos, sanciones ni teléfonos.`;

export async function POST(req: Request) {
  const startedAt = Date.now();
  let body: { question?: string; sessionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const question = (body.question || "").trim();
  const sessionId = body.sessionId || crypto.randomUUID();

  if (!question) {
    return NextResponse.json({ error: "Pregunta vacía" }, { status: 400 });
  }
  if (question.length > 500) {
    return NextResponse.json(
      { error: "La pregunta es muy larga (máx 500 caracteres)" },
      { status: 400 },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Bot no configurado: falta OPENAI_API_KEY" },
      { status: 503 },
    );
  }

  let hits;
  try {
    hits = await search(question, 5, 0.2);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: `Falla en búsqueda RAG: ${msg}` },
      { status: 500 },
    );
  }

  const context = hits.length === 0
    ? "(no se encontró contexto relevante)"
    : hits
        .map(
          (h, i) =>
            `[${i + 1}] ${h.doc.title} (categoría: ${h.doc.category}, score ${h.score.toFixed(2)})\n${h.doc.content}`,
        )
        .join("\n\n---\n\n");

  let completion;
  try {
    completion = await getOpenAI().chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.3,
      max_tokens: 400,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `CONTEXTO (información indexada de PulmoVerde):\n\n${context}\n\nPREGUNTA DEL USUARIO:\n${question}`,
        },
      ],
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: `Falla en OpenAI: ${msg}` },
      { status: 502 },
    );
  }

  const answer = completion.choices[0]?.message?.content?.trim() || "";
  const tokensIn = completion.usage?.prompt_tokens ?? 0;
  const tokensOut = completion.usage?.completion_tokens ?? 0;
  const cost = estimateCost("gpt-4o-mini", tokensIn, tokensOut);
  const latency = Date.now() - startedAt;

  const sources = hits.map((h) => ({
    id: h.doc.id,
    title: h.doc.title,
    category: h.doc.category,
    score: h.score,
  }));

  // Log conversation (best-effort, don't fail the request).
  try {
    await supabaseAdmin.from("chat_conversations").insert({
      session_id: sessionId,
      question,
      answer,
      sources,
      tokens_in: tokensIn,
      tokens_out: tokensOut,
      cost_usd: cost,
      latency_ms: latency,
    });
  } catch {
    // ignore
  }

  return NextResponse.json({
    answer,
    sources,
    sessionId,
    meta: { tokensIn, tokensOut, cost, latency },
  });
}
