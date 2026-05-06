import { NextResponse } from "next/server";
import { setAdminCookie, clearAdminCookie } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as {
    password?: string;
  };
  if (!password) {
    return NextResponse.json({ error: "Password requerido" }, { status: 400 });
  }
  const ok = await setAdminCookie(password);
  if (!ok) {
    return NextResponse.json({ error: "Password incorrecto" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
