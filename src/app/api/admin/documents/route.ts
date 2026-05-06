import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import {
  listDocuments,
  upsertDocument,
  deleteDocument,
} from "@/lib/rag";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }
  try {
    const docs = await listDocuments();
    // Strip embedding from list response (heavy, not needed for UI).
    const lite = docs.map((d) => ({
      id: d.id,
      title: d.title,
      content: d.content,
      category: d.category,
      source: d.source,
      hasEmbedding: Array.isArray(d.embedding) && d.embedding.length > 0,
      created_at: d.created_at,
      updated_at: d.updated_at,
    }));
    return NextResponse.json({ documents: lite });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { id, title, content, category, source } = body as {
    id?: string;
    title?: string;
    content?: string;
    category?: string;
    source?: string;
  };
  if (!title || !content || !category) {
    return NextResponse.json(
      { error: "title, content, category son requeridos" },
      { status: 400 },
    );
  }
  try {
    const doc = await upsertDocument({ id, title, content, category, source });
    return NextResponse.json({ document: doc });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id requerido" }, { status: 400 });
  }
  try {
    await deleteDocument(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
