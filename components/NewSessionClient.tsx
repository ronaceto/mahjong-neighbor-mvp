"use client";

import AdminKeyField from "@/components/AdminKeyField";
import { useSessionFormGuard } from "@/components/FormGuards";

function Banner({
  kind = "error",
  children,
}: {
  kind?: "success" | "error";
  children: React.ReactNode;
}) {
  const cls =
    kind === "success"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
      : "border-rose-400/30 bg-rose-400/10 text-rose-100";
  return <div className={`rounded-xl border p-3 text-sm ${cls}`}>{children}</div>;
}

export default function NewSessionClient() {
  const { err, onSubmit } = useSessionFormGuard();

  return (
    <section className="surface mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold text-white">Create Session</h1>
      <p className="mt-1 text-sm text-white/70">
        Admin key required. Times are in your local timezone.
      </p>

      {err && (
        <div className="mt-4">
          <Banner>{err}</Banner>
        </div>
      )}

      <form method="post" action="/api/sessions/create" onSubmit={onSubmit} className="mt-5 grid gap-4">
        <AdminKeyField />

        <div>
          <label className="label">Title</label>
          <input name="title" className="input" placeholder="Casual Play Friday" required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Start</label>
            <input name="start_at" type="datetime-local" className="input" required />
          </div>
          <div>
            <label className="label">End</label>
            <input name="end_at" type="datetime-local" className="input" required />
          </div>
        </div>

        <div>
          <label className="label">Location</label>
          <input name="location_text" className="input" placeholder="Neighborhood Clubhouse" required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Seats</label>
            <input name="seats" type="number" min="1" className="input" defaultValue={4} required />
          </div>
          <div>
            <label className="label">Notes (optional)</label>
            <input name="notes" className="input" placeholder="Snacks welcome. Bring your NMJL card." />
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <button className="btn btn-primary">Create</button>
          <a href="/" className="btn btn-ghost">Cancel</a>
        </div>
      </form>
    </section>
  );
}