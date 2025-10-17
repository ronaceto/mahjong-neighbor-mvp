// lib/db.ts
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function getPool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it in Netlify (Site settings → Environment variables) or in .env.local."
    );
  }
  if (!global.__pgPool) {
    global.__pgPool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false }, // Neon
    });
  }
  return global.__pgPool;
}

export async function query<T = any>(text: string, params?: any[]) {
  const client = await getPool().connect();
  try {
    const res = await client.query(text, params); // no generic here
    return res.rows as T[];
  } finally {
    client.release();
  }
}

export async function tx<T = any>(fn: (c: any) => Promise<T>) {
  const client = await getPool().connect();
  try {
    await client.query("begin");
    const out = await fn(client);
    await client.query("commit");
    return out;
  } catch (e) {
    await client.query("rollback");
    throw e;
  } finally {
    client.release();
  }
}
