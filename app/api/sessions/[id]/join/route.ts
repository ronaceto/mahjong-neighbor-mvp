export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { tx } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const form = await req.formData();
  const name  = String(form.get("name"));
  const email = String(form.get("email")).toLowerCase();

  await tx(async (c:any) => {
    await c.query("select id,seats from session where id=$1 for update", [params.id]);
    const confirmed = await c.query("select seat_number from signup where session_id=$1 and status='confirmed'", [params.id]);
    const capRes = await c.query("select seats from session where id=$1", [params.id]);
    const seats = capRes.rows[0].seats;
    const taken = confirmed.rowCount;

    let seat = null;
    if (taken < seats) {
      const takenSeats = new Set(confirmed.rows.map((r:any)=>r.seat_number).filter((n:any)=>n!=null));
      for (let i=1;i<=seats;i++){ if(!takenSeats.has(i)){ seat = i; break; } }
    }
    const status = taken < seats ? "confirmed" : "waitlist";

    await c.query(
      `insert into signup (session_id,name,email,status,seat_number)
       values ($1,$2,$3,$4,$5)
       on conflict (session_id,email) do update set status=excluded.status, seat_number=excluded.seat_number`,
      [params.id, name, email, status, seat]
    );
  });

  return NextResponse.redirect(new URL(`/sessions/${params.id}`, process.env.APP_BASE_URL || "http://localhost:3000"));
}
