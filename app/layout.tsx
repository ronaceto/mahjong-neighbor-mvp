// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { Sparkles, CalendarDays, BookOpen } from "lucide-react";

export const metadata = { title: "Mahjong Neighbor" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white shadow-soft">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-white">
                <div className="text-sm leading-tight opacity-75">Mahjong</div>
                <div className="text-lg -mt-1 font-semibold tracking-tight">Neighbor</div>
              </div>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-3">
              <Link href="/" className="btn btn-ghost">
                <CalendarDays className="h-4 w-4" />
                Sessions
              </Link>
              <Link href="/cheatsheets" className="btn btn-outline">
                <BookOpen className="h-4 w-4" />
                Cheat Sheets
              </Link>
              <Link href="/sessions/new" className="btn btn-primary hidden sm:inline-flex">
                Create Session
              </Link>
            </nav>
          </div>
        </header>

        {/* Page */}
        <main className="container py-8">{children}</main>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 py-8 text-center text-xs text-white/60">
          Built with ❤️ for the neighborhood • © {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
