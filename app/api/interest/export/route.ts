export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== process.env.INTEREST_EXPORT_KEY) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { rows } = await query<any>(`
    select
      name, email,
      mon, tue, wed, thu, fri,
      coalesce(timezone,'') as timezone,
      to_char(created_at at time zone 'America/Chicago','YYYY-MM-DD HH24:MI') as created_ct
    from interest_signup
    order by created_at desc
  `);

  const header = "name,email,mon,tue,wed,thu,fri,timezone,created_ct";
  const lines = rows.map((r: any) =>
    [
      r.name,
      r.email,
      r.mon ? "1" : "0",
      r.tue ? "1" : "0",
      r.wed ? "1" : "0",
      r.thu ? "1" : "0",
      r.fri ? "1" : "0",
      r.timezone,
      r.created_ct,
    ]
      .map((x) => `"${String(x ?? "").replaceAll(`"`, `""`)}"`)
      .join(",")
  );

  const csv = [header, ...lines].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="interest.csv"`,
    },
  });
}
