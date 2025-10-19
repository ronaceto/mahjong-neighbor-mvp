export function Flash({ ok, error }: { ok?: string; error?: string }) {
    if (!ok && !error) return null;
    const isOk = Boolean(ok);
    const cls = isOk
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
      : "border-rose-400/30 bg-rose-400/10 text-rose-100";
    const msg = isOk ? ok : error;
    return <div className={`rounded-xl border p-3 text-sm ${cls}`}>{msg}</div>;
  }