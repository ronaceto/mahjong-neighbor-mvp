export const runtime = "nodejs";

import NewSessionClient from "@/components/NewSessionClient";

export default function NewSessionPage() {
  // Server component wrapper — safe to keep runtime + DB access later if needed
  return <NewSessionClient />;
}