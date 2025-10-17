export const runtime = "nodejs";

export default function NewSessionPage() {
  return (
    <section className="surface mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold text-white">Create Session</h1>
      <p className="mt-1 text-sm text-white/70">
        Admin key required. Times are in your local timezone.
      </p>

      <form method="post" action="/api/sessions/create" className="mt-5 grid gap-4">
        <div>
          <label className="label">Admin Key</label>
          <input name="adminKey" placeholder="••••••••••" className="input" required />
        </div>

        <div>
          <label className="label">Title</label>
          <input name="title" placeholder="Casual Play Friday" className="input" required />
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
          <input name="location_text" placeholder="Neighborhood Clubhouse" className="input" required />
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