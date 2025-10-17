export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { query } from "@/lib/db";
import SessionCard from "@/components/SessionCard";
import { Plus } from "lucide-react";

export default async function Home() {
  const sessions = await query<{
    id: string;
    title: string;
    start_at: string;
    location_text: string;
    seats: number;
  }>(
    `select id,title,start_at,location_text,seats
     from session
     where start_at > now()
     order by start_at asc
     limit 20`
  );

  return (
    <>
      {/* Hero */}
      <section className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-700/40 via-brand-600/20 to-transparent p-6 sm:p-8 surface">
        <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold gradient-text">
              Find a seat. Learn together. Play often.
            </h1>
            <p className="mt-3 text-white/80">
              Neighborhood Mahjong sessions, waitlists, and printable cheat sheets — all in one place.
            </p>
            <div className="mt-5 flex gap-3">
              <Link href="/sessions/new" className="btn btn-primary">
                <Plus className="h-4 w-4" />
                Create Session
              </Link>
              <Link href="/cheatsheets" className="btn btn-ghost">
                View Cheat Sheets
              </Link>
            </div>
          </div>
          <div className="hidden sm:block">
            {/* simple decorative grid */}
            <div className="grid grid-cols-6 gap-2 opacity-60">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="h-8 rounded-lg bg-white/10" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Upcoming Sessions</h2>
          <Link href="/sessions/new" className="btn btn-outline sm:hidden">
            <Plus className="h-4 w-4" />
            Create
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="surface p-6 text-white/80">
            No sessions scheduled yet. Be the first to{" "}
            <Link href="/sessions/new" className="underline">
              create one
            </Link>
            !
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((s) => (
              <SessionCard key={s.id} {...s} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}