export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { query } from "@/lib/db";
import { toICS } from "@/lib/ics";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const { sessionId, name, email } = await req.json();

  const { rows: [signup] } = await query<any>(
    `insert into signup(session_id,name,email,status)
     values($1,$2,$3,'confirmed')
     returning id, unsub_token`,
    [sessionId, name, email]
  );

  const { rows: [sess] } = await query<any>(
    "select id,title,starts_at,ends_at,location from session where id=$1",
    [sessionId]
  );

  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  const manageUrl = `${base}/sessions/${sess.id}`;
  const unsubUrl  = `${base}/api/email/unsub?token=${signup.unsub_token}`;

  const ics = toICS({
    uid: crypto.randomUUID(),
    title: sess.title,
    startUtc: new Date(sess.starts_at),
    endUtc:   new Date(sess.ends_at),
    location: sess.location ?? "",
    url: manageUrl,
    description: "Mahjong Neighbor session",
  });

  const tz = "America/Chicago";
  const startLocal = new Date(sess.starts_at).toLocaleString("en-US",{timeZone:tz,dateStyle:"full",timeStyle:"short"});
  const endLocal   = new Date(sess.ends_at).toLocaleString("en-US",{timeZone:tz,dateStyle:"full",timeStyle:"short"});

  const text = [
    `Hi ${name || "there"},`,
    `You're confirmed for "${sess.title}".`,
    `When: ${startLocal} – ${endLocal}`,
    `Where: ${sess.location || "TBD"}`,
    `Manage: ${manageUrl}`,
    `Unsubscribe: ${unsubUrl}`
  ].join("\n");

  await sendEmail({
    to: email,
    subject: `You're confirmed: ${sess.title}`,
    text,
    html: text.replace(/\n/g,"<br>"),
    attachments: [{ filename:"session.ics", content: Buffer.from(ics), contentType:"text/calendar" }],
    headers: { "List-Unsubscribe": `<${unsubUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" }
  });

  await query("update signup set confirm_sent_at=now() where id=$1", [signup.id]);
  return NextResponse.json({ ok: true, id: signup.id });
}