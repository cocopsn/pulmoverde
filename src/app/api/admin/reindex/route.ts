import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { reindexAll, upsertDocument, listDocuments } from "@/lib/rag";
import { SEED_DOCUMENTS } from "@/lib/knowledge-seed";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { seed?: boolean };

  try {
    if (body.seed) {
      // Seed only if base is empty (avoid duplicates).
      const existing = await listDocuments();
      const titles = new Set(existing.map((d) => d.title));
      let inserted = 0;
      for (const doc of SEED_DOCUMENTS) {
        if (titles.has(doc.title)) continue;
        await upsertDocument(doc);
        inserted++;
      }
      return NextResponse.json({
        seeded: inserted,
        total_after: existing.length + inserted,
      });
    }

    const count = await reindexAll();
    return NextResponse.json({ reindexed: count });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
