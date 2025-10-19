import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://YOURDOMAIN.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Disallow private/internal paths if any:
        // disallow: ["/admin", "/api"]
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}