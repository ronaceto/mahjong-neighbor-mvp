export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ ok:false }, { status:400 });
  await query("update signup set unsub_at=now() where unsub_token=$1", [token]);
  return new NextResponse("<h1>You're unsubscribed</h1>", { headers:{ "Content-Type":"text/html" }});
}