import "./globals.css";
import type { Metadata, Viewport } from "next";

/**
 * Global site metadata
 * Used for SEO, open-graph, and sitemap generation.
 */
export const metadata: Metadata = {
  title: "Mahjong Neighbor",
  description:
    "Neighborhood Mahjong sessions, waitlists, and printable cheat sheets.",
  metadataBase: new URL("https://mahjong-neighbor-mvp.netlify.app"),
  openGraph: {
    title: "Mahjong Neighbor",
    description:
      "Neighborhood Mahjong sessions, waitlists, and printable cheat sheets.",
    url: "https://mahjong-neighbor-mvp.netlify.app",
    siteName: "Mahjong Neighbor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahjong Neighbor",
    description:
      "Neighborhood Mahjong sessions, waitlists, and printable cheat sheets.",
  },
};

/**
 * Browser viewport / theme configuration
 * Replaces deprecated `themeColor` in metadata.
 */
export const viewport: Viewport = {
  themeColor: "#ffffff", // adjust to your brand color if you like
};

/**
 * Root layout wraps all pages.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white text-gray-900">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
