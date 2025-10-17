"use client";
export default function Page(){
  return (<main className="mx-auto max-w-3xl p-6 prose">
    <div className="flex justify-between"><h1>🎴 Mahjong Tile Reference</h1><button onClick={()=>window.print()} className="border px-3 py-1 rounded">Print</button></div>
    <h2>🧩 Suits</h2><h3>Bams 🔷</h3><p>1–9, four each</p>
    <h3>Dots ⚪</h3><p>1–9, four each</p>
    <h3>Craks 🟥</h3><p>1–9, four each</p>
    <h2>🌬️ Winds</h2><ul><li>E/S/W/N ×4 each</li></ul>
    <h2>🐉 Dragons</h2><ul><li>Red / Green / White ×4 each</li></ul>
    <h2>🌸 Flowers & 🃏 Jokers</h2><ul><li>Flowers 1–8 (8 total)</li><li>Jokers (8) for exposed sets only</li></ul>
    <h2>Patterns</h2><ul><li>Pair, Pung, Kong, Quint</li><li>Run within a suit</li></ul>
    <h3>Refs</h3><ul><li><a target="_blank" href="https://ilovemahj.com/learn/tiles">Mahjong Tile Guide – I Love Mahj</a></li>
    <li><a target="_blank" href="https://www.nationalmahjonggleague.org/">National Mahjongg League</a></li></ul>
  </main>);
}
