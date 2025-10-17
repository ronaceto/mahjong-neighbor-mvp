export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const form = await req.formData();
  const adminKey = String(form.get("adminKey")||"");
  if (adminKey !== process.env.ADMIN_KEY) return NextResponse.json({error:"Forbidden"}, {status:403});

  const title = String(form.get("title"));
  const start_at = new Date(String(form.get("start_at")));
  const end_at = new Date(String(form.get("end_at")));
  const location_text = String(form.get("location_text"));
  const seats = Number(form.get("seats"));
  const notes = String(form.get("notes")||"");

  await query(
    `insert into session (title,start_at,end_at,location_text,seats,notes) values ($1,$2,$3,$4,$5,$6)`,
    [title, start_at.toISOString(), end_at.toISOString(), location_text, seats, notes]
  );

  return NextResponse.redirect(new URL("/", process.env.APP_BASE_URL || "http://localhost:3000"));
}
