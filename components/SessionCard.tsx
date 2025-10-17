// components/SessionCard.tsx
import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";

function fmt(d: string) {
  return new Date(d).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function SessionCard(props: {
  id: string;
  title: string;
  start_at: string;
  location_text: string;
  seats: number;
  confirmedCount?: number;
}) {
  const seatsText =
    typeof props.confirmedCount === "number"
      ? `${props.confirmedCount}/${props.seats}`
      : `${props.seats}`;

  return (
    <Link href={`/sessions/${props.id}`} className="block surface p-5 hover:bg-white/10 transition">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-white text-lg font-semibold">{props.title}</h3>
        <span className="badge">{seatsText} seats</span>
      </div>

      <div className="mt-3 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 opacity-80" />
          {fmt(props.start_at)}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 opacity-80" />
          {props.location_text}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
        <Users className="h-3.5 w-3.5" />
        Tap to view & join
      </div>
    </Link>
  );
}
