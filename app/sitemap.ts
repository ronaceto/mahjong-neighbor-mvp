import type { MetadataRoute } from "next";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic"; // avoid static export crashes if DB is empty

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/sessions`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/cheatsheets`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  // Try to include dynamic entities, but NEVER fail the build if DB shape differs.
  let sessionRoutes: MetadataRoute.Sitemap = [];
  let cheatRoutes: MetadataRoute.Sitemap = [];

  try {
    // Prefer columns that actually exist in your schema.
    // sessions: id, starts_at (you already use these elsewhere)
    const sessions = await query<{ id: string; starts_at: string }>(
      "select id, starts_at from session order by starts_at desc"
    );
    sessionRoutes = sessions.rows.map((s) => ({
      url: `${base}/sessions/${s.id}`,
      lastModified: s.starts_at || now,
      changeFrequency: "daily",
      priority: 0.7,
    }));
  } catch {
    // swallow — keep static only
  }

  try {
    // cheat_sheet: slug is enough; if you don’t have a table, this will also just swallow
    const cheats = await query<{ slug: string }>(
      "select slug from cheat_sheet order by slug asc"
    );
    cheatRoutes = cheats.rows.map((c) => ({
      url: `${base}/cheatsheets/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    }));
  } catch {
    // swallow
  }

  return [...staticRoutes, ...sessionRoutes, ...cheatRoutes];
}