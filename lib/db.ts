import { Pool, QueryResultRow } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function query<T extends QueryResultRow = any>(text: string, params?: any[]) {
  const client = await pool.connect();
  try { const res = await client.query<T>(text, params); return res.rows; }
  finally { client.release(); }
}

export async function tx<T=any>(fn: (c: any)=>Promise<T>) {
  const client = await pool.connect();
  try { await client.query("begin"); const out = await fn(client); await client.query("commit"); return out; }
  catch (e) { await client.query("rollback"); throw e; }
  finally { client.release(); }
}
