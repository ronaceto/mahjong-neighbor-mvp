export default function NotFound() {
    return (
      <main className="container py-16">
        <div className="surface mx-auto max-w-xl p-8 text-center">
          <h1 className="text-3xl font-semibold gradient-text">404 — Page not found</h1>
          <p className="mt-3 text-white/80">The page you’re looking for doesn’t exist.</p>
          <a href="/" className="btn btn-primary mt-6">Go home</a>
        </div>
      </main>
    );
  }