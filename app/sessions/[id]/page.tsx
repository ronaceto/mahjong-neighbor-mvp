export const runtime = "nodejs";
import { query } from "@/lib/db";

function fmt(d: string){
  return new Date(d).toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle:"medium", timeStyle:"short" });
}

export default async function SessionPage({ params }: { params: { id: string } }) {
  const [s] = await query<any>(`select * from session where id=$1`, [params.id]);
  if (!s) return <main className="p-6">Not found</main>;

  const signups = await query<any>(
    `select name,email,status,seat_number,created_at from signup where session_id=$1 order by status desc, created_at asc`, [params.id]
  );
  const confirmed = signups.filter((x:any)=>x.status==='confirmed');
  const waitlist  = signups.filter((x:any)=>x.status==='waitlist');
  const seatsLeft = s.seats - confirmed.length;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-2">{s.title}</h1>
      <div className="text-sm text-neutral-600 mb-4">{fmt(s.start_at)} — {fmt(s.end_at)} • {s.location_text}</div>
      <div className="mb-6 whitespace-pre-wrap">{s.notes}</div>

      <div className="mb-4">Seats: {confirmed.length}/{s.seats} {seatsLeft>0 ? `( ${seatsLeft} open )` : `( full )`}</div>

      <form method="post" action={`/api/sessions/${s.id}/join`} className="space-y-2 mb-6">
        <input name="name" placeholder="Your name" className="w-full border p-2 rounded" required />
        <input name="email" placeholder="you@email.com" className="w-full border p-2 rounded" required />
        <button className="rounded-lg border px-3 py-1">Join</button>
        <a className="ml-3 rounded-lg border px-3 py-1" href={`/api/sessions/${s.id}/ical`}>Add to Calendar (.ics)</a>
      </form>

      <h2 className="font-medium mb-2">Confirmed</h2>
      <ul className="mb-4 list-disc pl-5">
        {confirmed.map((x:any,i:number)=><li key={i}>{x.name} {x.seat_number ? `(Seat ${x.seat_number})` : ''}</li>)}
      </ul>

      {waitlist.length>0 && <>
        <h2 className="font-medium mb-2">Waitlist</h2>
        <ul className="list-disc pl-5">{waitlist.map((x:any,i:number)=><li key={i}>{x.name}</li>)}</ul>
      </>}

      <h3 className="mt-6 font-medium">Need to leave?</h3>
      <form method="post" action={`/api/sessions/${s.id}/leave`} className="space-y-2">
        <input name="email" placeholder="you@email.com" className="w-full border p-2 rounded" required />
        <button className="rounded-lg border px-3 py-1">Leave</button>
      </form>
    </main>
  );
}
