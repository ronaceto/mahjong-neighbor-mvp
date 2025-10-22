export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { query as dbQuery } from "@/lib/db";
import { toICS } from "@/lib/ics";
import { sendEmail } from "@/lib/mailer";

// Normalize query result: supports libs that return array OR { rows: array }
async function q<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const res: any = await dbQuery(sql, params);
  if (Array.isArray(res)) return res as T[];
  if (res && Array.isArray(res.rows)) return res.rows as T[];
  // Some helpers return { rowCount, rows } or { data }
  if (res && Array.isArray(res.data)) return res.data as T[];
  return [];
}

function safe(env?: string) {
  return env ? "set" : "missing";
}

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
    const { sessionId, name, email } = await req.json();

    if (!sessionId || !email) {
      return NextResponse.json(
        { ok: false, where: "validate", detail: "sessionId and email are required" },
        { status: 400 }
      );
    }

    const base = process.env.NEXT_PUBLIC_SITE_URL;
    console.log("[signup] env check:", {
      NEXT_PUBLIC_SITE_URL: safe(base),
      DATABASE_URL: safe(process.env.DATABASE_URL),
      SMTP_HOST: safe(process.env.SMTP_HOST),
      SMTP_USER: safe(process.env.SMTP_USER),
      SMTP_PASS: safe(process.env.SMTP_PASS),
      EMAIL_FROM: safe(process.env.EMAIL_FROM),
    });

    // 1) Load session (robust rows handling)
    let sess: any;
    try {
      const rows = await q<any>(
        "select id, title, starts_at, ends_at, location from session where id=$1",
        [sessionId]
      );
      sess = rows?.[0];
      if (!sess) {
        return NextResponse.json(
          { ok: false, where: "load_session", detail: "Session not found" },
          { status: 404 }
        );
      }
    } catch (e: any) {
      console.error("[signup] DB error (load_session):", e?.message || e);
      return NextResponse.json(
        { ok: false, where: "db_load_session", detail: e?.message || String(e) },
        { status: 500 }
      );
    }

    // 2) Insert signup and get id + unsub_token
    let signup: any;
    try {
      const rows = await q<any>(
        `insert into signup (session_id, name, email, status, unsub_token)
         values ($1,$2,$3,'confirmed', coalesce($4, encode(gen_random_bytes(16), 'hex')))
         returning id, unsub_token`,
        [sessionId, name ?? null, email, null]
      );
      signup = rows?.[0];
    } catch (e: any) {
      console.error("[signup] DB error (insert_signup):", e?.message || e);
      return NextResponse.json(
        { ok: false, where: "db_insert_signup", detail: e?.message || String(e) },
        { status: 500 }
      );
    }

    // 3) Build ICS + content
    const manageUrl = `${base}/sessions/${sess.id}`;
    const unsubUrl = `${base}/api/email/unsub?token=${signup?.unsub_token ?? "missing"}`;

    const ics = toICS({
      uid: crypto.randomUUID(),
      title: sess.title,
      description: "Mahjong Neighbor session",
      startUtc: new Date(sess.starts_at),
      endUtc: new Date(sess.ends_at),
      location: sess.location ?? "",
      url: manageUrl,
    });

    const tz = "America/Chicago";
    const startLocal = new Date(sess.starts_at).toLocaleString("en-US", {
      timeZone: tz,
      dateStyle: "full",
      timeStyle: "short",
    });
    const endLocal = new Date(sess.ends_at).toLocaleString("en-US", {
      timeZone: tz,
      dateStyle: "full",
      timeStyle: "short",
    });

    const subject = `You're confirmed: ${sess.title}`;
    const text = [
      `Hi ${name || "there"},`,
      `You're confirmed for "${sess.title}".`,
      `When: ${startLocal} – ${endLocal}`,
      `Where: ${sess.location || "TBD"}`,
      `Manage: ${manageUrl}`,
      `Unsubscribe: ${unsubUrl}`,
    ].join("\n");

    // 4) Send email
    try {
      await sendEmail({
        to: email,
        subject,
        text,
        html: text.replace(/\n/g, "<br>"),
        attachments: [
          {
            filename: "session.ics",
            content: Buffer.from(ics),
            contentType: "text/calendar",
          },
        ],
        headers: {
          "List-Unsubscribe": `<${unsubUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },

        bcc: process.env.NOTIFY_TO || undefined,
      });
      console.log("[signup] email sent to", email);
    } catch (e: any) {
      console.error("[signup] email error:", e?.message || e);
      return NextResponse.json(
        { ok: false, where: "email_send", detail: e?.message || String(e) },
        { status: 500 }
      );
    }

    // 5) Mark sent
    try {
      await q("update signup set confirm_sent_at=now() where id=$1", [signup.id]);
    } catch (e: any) {
      console.error("[signup] DB error (mark_sent):", e?.message || e);
      // don't fail the request if email already sent
    }

    console.log("[signup] done in", Date.now() - t0, "ms");
    return NextResponse.json({ ok: true, id: signup.id });
  } catch (e: any) {
    console.error("[signup] fatal error:", e?.message || e);
    return NextResponse.json(
      { ok: false, where: "fatal", detail: e?.message || String(e) },
      { status: 500 }
    );
  }
}

// Simple GET so a browser visit doesn't 405
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "POST { sessionId, name, email }",
  });
}
