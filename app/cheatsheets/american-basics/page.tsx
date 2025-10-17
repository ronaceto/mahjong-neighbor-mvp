"use client";
export default function Page(){
  return (<main className="mx-auto max-w-3xl p-6 prose">
    <div className="flex justify-between"><h1>🀄 American Mahjong Basics</h1><button onClick={()=>window.print()} className="border px-3 py-1 rounded">Print</button></div>
    <h3>🎯 Objective</h3><p>Assemble a <b>complete hand</b> matching the current <b>NMJL Card</b>.</p>
    <h2>🧩 Tile Categories</h2>
    <table><thead><tr><th>Category</th><th>Symbol</th><th>Count</th><th>Notes</th></tr></thead>
    <tbody><tr><td>Suits</td><td>🔷 / ⚪ / 🟥</td><td>36 each</td><td>1–9 × 4</td></tr>
    <tr><td>Winds</td><td>E S W N</td><td>16</td><td>4 each</td></tr>
    <tr><td>Dragons</td><td>Red/Green/White</td><td>12</td><td>4 each</td></tr>
    <tr><td>Flowers</td><td>🌸</td><td>8</td><td>Bonus</td></tr>
    <tr><td>Jokers</td><td>🃏</td><td>8</td><td>Wildcards (exposed sets only)</td></tr></tbody></table>
    <p><i>Total tiles: 152</i></p>
    <h2>🏗️ Setup</h2><ol><li>4 players</li><li>Build wall: 19×2 stacks each</li><li>Dice to break wall</li><li>Draw 13 (East 14)</li><li>Charleston exchange</li></ol>
    <h2>🔁 Turn</h2><ol><li>Draw</li><li>Discard</li><li>Calls for pung/kong/mahjong</li></ol>
    <h2>🧠 Quick Rules</h2><ul><li>Called sets are exposed</li><li>Jokers only in exposed sets</li><li>No discard claim to finish a concealed hand</li><li>Ends when wall exhausted</li></ul>
    <h2>🧭 Links</h2><ul>
      <li><a target="_blank" href="https://www.nationalmahjonggleague.org/">NMJL</a></li>
      <li><a target="_blank" href="https://ilovemahj.com/learn/tutorials">I Love Mahj Tutorials</a></li>
      <li><a target="_blank" href="https://www.youtube.com/watch?v=ebPizTCb7EU">Beginner Video</a></li>
    </ul>
  </main>);
}
