export const runtime = "nodejs";

import { query } from "@/lib/db";
import { Calendar, Clock, MapPin, Users, Download } from "lucide-react";
import { Flash } from "@/components/Flash";

function fmt(d: string) {
  return new Date(d).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: Record<string, string>;
}) {
  const ok = searchParams?.ok;
  const error = searchParams?.error;

  const [s] = await query<any>(`select * from session where id=$1`, [params.id]);
  if (!s) return <main className="p-6">Not found</main>;

  const signups = await query<any>(
    `select name,email,status,seat_number,created_at
     from signup
     where session_id=$1
     order by status desc, created_at asc`,
    [params.id]
  );

  const confirmed = signups.filter((x: any) => x.status === "confirmed");
  const waitlist = signups.filter((x: any) => x.status === "waitlist");
  const seatsLeft = s.seats - confirmed.length;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Flash banner row */}
      {(ok || error) && (
        <div className="lg:col-span-3">
          <Flash ok={ok} error={error} />
        </div>
      )}

      {/* Main card */}
      <section className="surface p-6 lg:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold text-white">{s.title}</h1>
          <a href={`/api/sessions/${s.id}/ical`} className="btn btn-outline">
            <Download className="h-4 w-4" />
            Add to Calendar
          </a>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-white/80">
            <Calendar className="h-4 w-4 opacity-80" />
            {fmt(s.start_at)}
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Clock className="h-4 w-4 opacity-80" />
            {fmt(s.end_at)}
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="h-4 w-4 opacity-80" />
            {s.location_text}
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Users className="h-4 w-4 opacity-80" />
            {confirmed.length}/{s.seats} seats {seatsLeft > 0 ? `(${seatsLeft} open)` : `(full)`}
          </div>
        </div>

        {s.notes && (
          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-white/85 whitespace-pre-wrap">
            {s.notes}
          </div>
        )}

        {/* Rosters */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-white/80">Confirmed</h3>
            <div className="flex flex-wrap gap-2">
              {confirmed.length === 0 ? (
                <span className="badge">No confirmed players yet</span>
              ) : (
                confirmed.map((x: any, i: number) => (
                  <span key={i} className="badge badge-green">
                    {x.name} {x.seat_number ? `(Seat ${x.seat_number})` : ""}
                  </span>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-white/80">Waitlist</h3>
            <div className="flex flex-wrap gap-2">
              {waitlist.length === 0 ? (
                <span className="badge">Empty</span>
              ) : (
                waitlist.map((x: any, i: number) => (
                  <span key={i} className="badge badge-yellow">
                    {x.name}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Join / Leave */}
      <aside className="surface p-6">
        <h3 className="text-lg font-semibold text-white">Join this session</h3>
        <p className="mt-1 text-sm text-white/70">
          Seats are assigned automatically. If it’s full, you’ll join the waitlist.
        </p>
        <form method="post" action={`/api/sessions/${s.id}/join`} className="mt-4 space-y-3">
          <div>
            <label className="label">Your name</label>
            <input name="name" className="input" placeholder="Jane Doe" required />
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" className="input" placeholder="you@email.com" required />
          </div>
          <button className="btn btn-primary w-full">Join Session</button>
        </form>

        <div className="mt-8 h-px w-full bg-white/10" />

        <h4 className="mt-6 text-sm font-medium text-white">Need to leave?</h4>
        <form method="post" action={`/api/sessions/${s.id}/leave`} className="mt-3 space-y-3">
          <div>
            <label className="label">Email used to join</label>
            <input name="email" className="input" placeholder="you@email.com" required />
          </div>
          <button className="btn btn-outline w-full">Leave Session</button>
        </form>
      </aside>
    </div>
  );
}