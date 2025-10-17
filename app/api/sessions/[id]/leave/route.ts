export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { tx } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const form = await req.formData();
  const email = String(form.get("email")).toLowerCase();

  await tx(async (c:any) => {
    const del = await c.query(`delete from signup where session_id=$1 and email=$2 returning seat_number`, [params.id, email]);
    const freedSeat = del.rows[0]?.seat_number ?? null;

    const nextWait = await c.query(
      `select id from signup where session_id=$1 and status='waitlist' order by created_at asc limit 1`, [params.id]
    );
    if (nextWait.rowCount) {
      const seat = freedSeat ?? (await (async () => {
        const cap = await c.query("select seats from session where id=$1", [params.id]);
        const seats = cap.rows[0].seats;
        const taken = await c.query("select seat_number from signup where session_id=$1 and status='confirmed'", [params.id]);
        const takenSet = new Set(taken.rows.map((r:any)=>r.seat_number).filter((n:any)=>n!=null));
        for (let i=1;i<=seats;i++){ if(!takenSet.has(i)) return i; }
        return null;
      })());
      await c.query(`update signup set status='confirmed', seat_number=$1 where id=$2`, [seat, nextWait.rows[0].id]);
    }
  });

  return NextResponse.redirect(new URL(`/sessions/${params.id}`, process.env.APP_BASE_URL || "http://localhost:3000"));
}
