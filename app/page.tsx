export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { query } from "@/lib/db";

function fmt(d: string){
  return new Date(d).toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle:"medium", timeStyle:"short" });
}

export default async function Home() {
  const sessions = await query<{id:string,title:string,start_at:string,location_text:string,seats:number}>(
    `select id,title,start_at,location_text,seats
     from session where start_at > now() order by start_at asc limit 10`
  );
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Mahjong Neighbor</h1>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Upcoming Sessions</h2>
        <Link href="/sessions/new" className="rounded-lg border px-3 py-1 text-sm">Create Session</Link>
      </div>
      <ul className="space-y-3">
        {sessions.map((s:{id:string,title:string,start_at:string,location_text:string})=>(
          <li key={s.id} className="rounded-2xl border p-4 hover:bg-neutral-50">
            <Link href={`/sessions/${s.id}`} className="block">
              <div className="font-medium">{s.title}</div>
              <div className="text-sm text-neutral-600">{fmt(s.start_at)} — {s.location_text}</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
