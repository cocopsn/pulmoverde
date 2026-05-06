import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, count, error } = await supabase
    .from("compromisos")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, total: count });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { nombre, colonia, acciones } = body;

  if (!nombre || !colonia || !acciones || acciones.length === 0) {
    return NextResponse.json(
      { error: "Nombre, colonia y al menos una accion son requeridos" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("compromisos")
    .insert({ nombre, colonia, acciones })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
