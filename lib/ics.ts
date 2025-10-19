export function toICS({
    uid,
    title,
    description,
    startUtc,
    endUtc,
    location,
    url,
  }: {
    uid: string;
    title: string;
    description?: string;
    startUtc: Date;
    endUtc: Date;
    location?: string;
    url?: string;
  }) {
    const dt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const escapeText = (s: string) =>
      s.replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
  
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//MahjongNeighbor//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${dt(new Date())}`,
      `DTSTART:${dt(startUtc)}`,
      `DTEND:${dt(endUtc)}`,
      `SUMMARY:${escapeText(title)}`,
      description ? `DESCRIPTION:${escapeText(description)}` : "",
      location ? `LOCATION:${escapeText(location)}` : "",
      url ? `URL:${escapeText(url)}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ].filter(Boolean);
  
    return lines.join("\r\n");
  }
  