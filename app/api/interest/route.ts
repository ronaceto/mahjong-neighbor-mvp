export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

function bool(v: any) {
  return v === true || v === "true" || v === 1 || v === "1";
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-nf-client-connection-ip") ??
      undefined;

    const body = await req.json();
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();

    if (!name || !email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
    }

    const mon = bool(body.mon);
    const tue = bool(body.tue);
    const wed = bool(body.wed);
    const thu = bool(body.thu);
    const fri = bool(body.fri);
    const timezone = body.timezone && String(body.timezone);

    // insert (on conflict do nothing)
    await query(
      `insert into interest_signup(name,email,mon,tue,wed,thu,fri,timezone,source,ip)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::inet)
       on conflict (lower(email)) do update set
         name=excluded.name,
         mon=excluded.mon, tue=excluded.tue, wed=excluded.wed, thu=excluded.thu, fri=excluded.fri,
         timezone=excluded.timezone,
         source=excluded.source`,
      [name, email, mon, tue, wed, thu, fri, timezone ?? null, "landing", ip ?? null]
    );

    // send a lightweight thank-you email (no ICS)
    const site = process.env.NEXT_PUBLIC_SITE_URL!;
    const subject = "Thanks — we’ll follow up about Mahjong nights";
    const text = [
      `Hi ${name},`,
      ``,
      `Thanks for raising your hand. We’re gauging interest and will email you when we open up actual session sign-ups.`,
      `You selected availability on weekday evenings${mon||tue||wed||thu||fri ? ":" : "."}`,
      mon ? " • Monday" : null,
      tue ? " • Tuesday" : null,
      wed ? " • Wednesday" : null,
      thu ? " • Thursday" : null,
      fri ? " • Friday" : null,
      ``,
      `You can visit the site anytime: ${site}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await sendEmail({
        to: email,
        subject,
        text,
        html: text.replace(/\n/g, "<br>"),
        bcc: process.env.NOTIFY_TO || undefined,
      });
    } catch (e) {
      // Don’t fail the UX if email bounces; we still saved the interest.
      console.error("[interest] email error", (e as any)?.message ?? e);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[interest] fatal", e?.message ?? e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
