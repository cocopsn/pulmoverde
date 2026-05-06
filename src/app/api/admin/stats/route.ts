import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }

  try {
    // Compromisos totals + by colonia + by accion + recent.
    const { data: comps, count: compsTotal } = await supabaseAdmin
      .from("compromisos")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(500);

    const byColonia: Record<string, number> = {};
    const byAccion: Record<string, number> = {};
    const last7days: Record<string, number> = {};
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    (comps || []).forEach((c) => {
      byColonia[c.colonia] = (byColonia[c.colonia] || 0) + 1;
      (c.acciones || []).forEach((a: string) => {
        byAccion[a] = (byAccion[a] || 0) + 1;
      });
      const t = new Date(c.created_at).getTime();
      if (t >= sevenDaysAgo) {
        const day = new Date(t).toISOString().slice(0, 10);
        last7days[day] = (last7days[day] || 0) + 1;
      }
    });

    // RAG documents count + by category.
    const { data: docs } = await supabaseAdmin
      .from("rag_documents")
      .select("category, embedding");
    const ragByCategory: Record<string, number> = {};
    let ragWithEmbedding = 0;
    (docs || []).forEach((d) => {
      ragByCategory[d.category] = (ragByCategory[d.category] || 0) + 1;
      if (Array.isArray(d.embedding) && d.embedding.length > 0) ragWithEmbedding++;
    });

    // Chat conversations: total + cost + recent.
    const { data: chats, count: chatsTotal } = await supabaseAdmin
      .from("chat_conversations")
      .select("question, answer, cost_usd, created_at, latency_ms", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .limit(20);

    const totalCost = (chats || []).reduce(
      (sum, c) => sum + Number(c.cost_usd || 0),
      0,
    );

    return NextResponse.json({
      compromisos: {
        total: compsTotal || 0,
        recent: (comps || []).slice(0, 10),
        byColonia,
        byAccion,
        last7days,
      },
      rag: {
        total: (docs || []).length,
        withEmbedding: ragWithEmbedding,
        byCategory: ragByCategory,
      },
      chat: {
        total: chatsTotal || 0,
        recent: chats || [],
        totalCost,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
