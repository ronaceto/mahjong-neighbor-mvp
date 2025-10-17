export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const [row] = await query<{ now: string }>("select now()");
    return NextResponse.json({ ok: true, now: row?.now });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
