"use client";
export default function Page(){
  return (<main className="mx-auto max-w-3xl p-6 prose">
    <div className="flex justify-between"><h1>🔄 Charleston Passing Guide</h1><button onClick={()=>window.print()} className="border px-3 py-1 rounded">Print</button></div>
    <h2>🧭 Sequence</h2>
    <table><thead><tr><th>Round</th><th>Direction</th><th>Tiles</th><th>Reverse?</th></tr></thead>
    <tbody><tr><td>1️⃣</td><td>Right</td><td>3</td><td>No</td></tr>
    <tr><td>2️⃣</td><td>Left</td><td>3</td><td>No</td></tr>
    <tr><td>3️⃣</td><td>Across</td><td>3</td><td>No</td></tr>
    <tr><td>4️⃣</td><td>Reverse (opt)</td><td>3</td><td>Yes (all agree)</td></tr></tbody></table>
    <h2>🧩 Tips</h2><ul><li>Keep sets</li><li>Never pass Flowers/Jokers</li><li>Focus on 1–2 suits</li><li>Save Jokers for exposures</li></ul>
    <h3>Refs</h3><ul><li><a target="_blank" href="https://ilovemahj.com/learn/charleston">I Love Mahj – Charleston</a></li>
    <li><a target="_blank" href="https://www.mahjongmolly.com/">Mahjong with Molly</a></li></ul>
  </main>);
}
