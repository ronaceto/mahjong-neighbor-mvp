"use client";

import { useState } from "react";

export function useSessionFormGuard() {
  const [err, setErr] = useState<string | null>(null);

  function validate(form: HTMLFormElement) {
    setErr(null);
    const start = (form.elements.namedItem("start_at") as HTMLInputElement)?.value;
    const end   = (form.elements.namedItem("end_at") as HTMLInputElement)?.value;
    const seats = Number((form.elements.namedItem("seats") as HTMLInputElement)?.value || 0);

    if (!start || !end) return setErr("Start and End are required.");
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return setErr("Invalid date/time.");
    if (endDate <= startDate) return setErr("End time must be after Start time.");
    if (!Number.isFinite(seats) || seats < 1) return setErr("Seats must be at least 1.");
    return true;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!validate(e.currentTarget)) {
      e.preventDefault();
    }
  }

  return { err, onSubmit };
}