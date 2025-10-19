export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { query } from "@/lib/db";
import { toICS } from "@/lib/ics";
import { sendEmail } from "@/lib/mailer";

function safe(env?: string) {
  return env ? "set" : "missing";
}

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
    const { sessionId, name, email } = await req.json();

    // Basic input validation
    if (!sessionId || !email) {
      return NextResponse.json(
        { ok: false, where: "validate", detail: "sessionId and email are required" },
        { status: 400 }
      );
    }

    // Quick env checks (no secrets logged)
    const base = process.env.NEXT_PUBLIC_SITE_URL;
    const envReport = {
      NEXT_PUBLIC_SITE_URL: safe(base),
      DATABASE_URL: safe(process.env.DATABASE_URL),
      SMTP_HOST: safe(process.env.SMTP_HOST),
      SMTP_USER: safe(process.env.SMTP_USER),
      SMTP_PASS: safe(process.env.SMTP_PASS),
      EMAIL_FROM: safe(process.env.EMAIL_FROM),
    };
    console.log("[signup] env check:", envReport);

    // 1) Load session first (fail fast if not found)
    let sess: any;
    try {
      const { rows } = await query<any>(
        "select id, title, starts_at, ends_at, location from session where id=$1",
        [sessionId]
      );
      sess = rows[0];
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

    // 2) Insert signup
    let signup: any;
    try {
      const ins = await query<any>(
        `insert into signup (session_id, name, email, status)
         values ($1,$2,$3,'confirmed')
         returning id, unsub_token`,
        [sessionId, name ?? null, email]
      );
      signup = ins.rows[0];
    } catch (e: any) {
      console.error("[signup] DB error (insert_signup):", e?.message || e);
      return NextResponse.json(
        { ok: false, where: "db_insert_signup", detail: e?.message || String(e) },
        { status: 500 }
      );
    }

    // 3) Build ICS
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
      await query("update signup set confirm_sent_at=now() where id=$1", [signup.id]);
    } catch (e: any) {
      console.error("[signup] DB error (mark_sent):", e?.message || e);
      // don't fail the whole request if the email already sent
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

// Optional GET for quick browser check
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "POST { sessionId, name, email }",
  });
}
