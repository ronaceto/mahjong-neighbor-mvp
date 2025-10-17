export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

function toICSDateTime(d: Date){
  const pad=(n:number)=>String(n).padStart(2,"0");
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}
function esc(s:string){ return s.replace(/[\\;,]/g,"\\$&").replace(/\n/g,"\\n"); }

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const [s] = await query<any>("select * from session where id=$1",[params.id]);
  if(!s) return new NextResponse("Not found",{status:404});
  const start = new Date(s.start_at); const end = new Date(s.end_at);
  const ics = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Mahjong Neighbor//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${s.id}@mahjong-neighbor`,
    `DTSTAMP:${toICSDateTime(new Date())}`,
    `DTSTART:${toICSDateTime(start)}`,
    `DTEND:${toICSDateTime(end)}`,
    `SUMMARY:${esc(s.title)}`,
    `LOCATION:${esc(s.location_text)}`,
    "END:VEVENT","END:VCALENDAR"
  ].join("\\r\\n");
  return new NextResponse(ics,{status:200,headers:{
    "Content-Type":"text/calendar; charset=utf-8",
    "Content-Disposition":`attachment; filename="${s.id}.ics"`,
  }});
}
