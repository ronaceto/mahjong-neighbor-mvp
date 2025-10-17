export const runtime = "nodejs";
import Link from "next/link";

export default function CheatSheetsIndex(){
  const items = [
    { slug:"american-basics", title:"American Mahjong Basics", desc:"Tiles, setup, flow, quick rules." },
    { slug:"charleston-guide", title:"Charleston Passing Guide", desc:"Passing sequence + strategy." },
    { slug:"tile-reference", title:"Mahjong Tile Reference", desc:"Suits, winds, dragons, jokers." },
  ];
  return (
    <>
      <h1 className="text-3xl font-semibold gradient-text mb-4">Cheat Sheets</h1>
      <p className="text-white/80 mb-6">Print-friendly helpers for learners and casual play.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(i=>(
          <Link key={i.slug} href={`/cheatsheets/${i.slug}`} className="surface p-5 hover:bg-white/10 transition block">
            <div className="text-lg font-semibold text-white">{i.title}</div>
            <div className="text-sm text-white/70 mt-1">{i.desc}</div>
            <div className="text-xs text-white/60 mt-4 underline">Open</div>
          </Link>
        ))}
      </div>
    </>
  );
}