"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <main className="container py-16">
          <div className="surface mx-auto max-w-xl p-8 text-center">
            <h1 className="text-3xl font-semibold gradient-text">Something went wrong</h1>
            <p className="mt-3 text-white/80">{error?.message || "Unknown error"}</p>
            <button onClick={reset} className="btn btn-primary mt-6">Try again</button>
            <a href="/" className="btn btn-ghost mt-3">Back home</a>
          </div>
        </main>
      </body>
    </html>
  );
}
