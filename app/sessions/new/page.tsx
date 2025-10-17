export const runtime = "nodejs";

export default function NewSessionPage(){
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold mb-4">Create Session</h1>
      <form method="post" action="/api/sessions/create" className="space-y-3">
        <input name="adminKey" placeholder="Admin Key" className="w-full border p-2 rounded" required />
        <input name="title" placeholder="Title" className="w-full border p-2 rounded" required />
        <input name="start_at" type="datetime-local" className="w-full border p-2 rounded" required />
        <input name="end_at" type="datetime-local" className="w-full border p-2 rounded" required />
        <input name="location_text" placeholder="Location" className="w-full border p-2 rounded" required />
        <input name="seats" type="number" min="1" className="w-full border p-2 rounded" required />
        <textarea name="notes" placeholder="Notes" className="w-full border p-2 rounded" />
        <button className="rounded-lg border px-3 py-1">Create</button>
      </form>
    </main>
  );
}
