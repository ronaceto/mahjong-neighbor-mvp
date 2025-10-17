export const runtime = "nodejs";
import Link from "next/link";
export default function CheatSheetsIndex(){
  const items = [
    { slug:"american-basics", title:"American Mahjong Basics", desc:"Tiles, setup, flow, quick rules." },
    { slug:"charleston-guide", title:"Charleston Passing Guide", desc:"Passing sequence + strategy." },
    { slug:"tile-reference", title:"Mahjong Tile Reference", desc:"Suits, winds, dragons, jokers." },
  ];
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Cheat Sheets</h1>
      <ul className="space-y-3">{items.map(i=>(
        <li key={i.slug} className="rounded-2xl border p-4 hover:bg-neutral-50">
          <Link href={`/cheatsheets/${i.slug}`} className="block">
            <div className="font-medium">{i.title}</div>
            <div className="text-sm text-neutral-600">{i.desc}</div>
          </Link>
        </li>
      ))}</ul>
    </main>
  );
}
