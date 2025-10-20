"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const Schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  mon: z.boolean().optional(),
  tue: z.boolean().optional(),
  wed: z.boolean().optional(),
  thu: z.boolean().optional(),
  fri: z.boolean().optional(),
});

type FormData = z.infer<typeof Schema>;

export default function HomePage() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: { mon: false, tue: false, wed: false, thu: false, fri: false },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    const anyDay = data.mon || data.tue || data.wed || data.thu || data.fri;
    if (!anyDay) {
      setError("Select at least one weekday evening.");
      return;
    }
    const res = await fetch("/api/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error ?? "Something went wrong. Please try again.");
      return;
    }
    setDone(true);
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Mahjong Neighbor</h1>
        <p className="mt-2 text-gray-600">
          We’re gauging interest for neighborhood Mahjong nights. Tell us your weekday evening availability and
          we’ll email you when sessions open.
        </p>
      </header>

      {done ? (
        <div className="rounded-xl border p-6 shadow-soft">
          <h2 className="text-xl font-medium">Thanks! You’re on the list.</h2>
          <p className="mt-2 text-gray-600">
            We’ll follow up by email soon with next steps.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border p-6 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className="text-sm font-medium">Name</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="Your name"
                {...register("name")}
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div className="sm:col-span-1">
              <label className="text-sm font-medium">Email</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="you@example.com"
                inputMode="email"
                {...register("email")}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium">Weekday evenings you might be available</label>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <label className="flex items-center gap-2 rounded-lg border px-3 py-2">
                <input type="checkbox" {...register("mon")} /> <span>Mon</span>
              </label>
              <label className="flex items-center gap-2 rounded-lg border px-3 py-2">
                <input type="checkbox" {...register("tue")} /> <span>Tue</span>
              </label>
              <label className="flex items-center gap-2 rounded-lg border px-3 py-2">
                <input type="checkbox" {...register("wed")} /> <span>Wed</span>
              </label>
              <label className="flex items-center gap-2 rounded-lg border px-3 py-2">
                <input type="checkbox" {...register("thu")} /> <span>Thu</span>
              </label>
              <label className="flex items-center gap-2 rounded-lg border px-3 py-2">
                <input type="checkbox" {...register("fri")} /> <span>Fri</span>
              </label>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white shadow-soft hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSubmitting ? "Submitting…" : "Notify me"}
            </button>
            <p className="text-xs text-gray-500">
              We’ll only email you about Mahjong sessions. You can unsubscribe anytime.
            </p>
          </div>
        </form>
      )}
    </main>
  );
}

//old
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { query } from "@/lib/db";
import SessionCard from "@/components/SessionCard";
import { Plus } from "lucide-react";
import { Flash } from "@/components/Flash";

export default async function Home({
  searchParams,
}: {
  searchParams?: Record<string, string>;
}) {
  const ok = searchParams?.ok;
  const error = searchParams?.error;

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
      {(ok || error) && (
        <div className="mb-4">
          <Flash ok={ok} error={error} />
        </div>
      )}

      {/* Hero */}
      <section className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-700/40 via-brand-600/20 to-transparent p-6 sm:p-8 surface">
        <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold gradient-text">
              Find a seat. Learn together. Play often.
            </h1>
            <p className="mt-3 text-white/80">
              Neighborhood Mahjong sessions, waitlists, and printable cheat
              sheets — all in one place.
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