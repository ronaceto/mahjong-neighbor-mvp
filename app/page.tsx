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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
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
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="sm:col-span-1">
              <label className="text-sm font-medium">Email</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="you@example.com"
                inputMode="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
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
