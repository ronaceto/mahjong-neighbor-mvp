export function Alert({ kind = "info", children }: { kind?: "info"|"success"|"error"; children: React.ReactNode }) {
    const styles = {
      info: "border-white/20 bg-white/10 text-white",
      success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
      error: "border-rose-400/30 bg-rose-400/10 text-rose-100",
    }[kind];
    return <div className={`rounded-xl border p-3 text-sm ${styles}`}>{children}</div>;
  }