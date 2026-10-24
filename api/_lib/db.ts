import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

// Files/folders prefixed with "_" inside /api are NOT deployed as endpoints on Vercel.

let sql: NeonQueryFunction<false, false> | null = null
let schemaReady: Promise<void> | null = null

export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

/** Returns a ready-to-use SQL tag, creating tables on first use. Null when no DATABASE_URL. */
export async function db(): Promise<NeonQueryFunction<false, false> | null> {
  const url = process.env.DATABASE_URL
  if (!url) return null
  if (!sql) sql = neon(url)
  if (!schemaReady) {
    const q = sql
    schemaReady = (async () => {
      await q`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id          SERIAL PRIMARY KEY,
          name        TEXT        NOT NULL,
          email       TEXT        NOT NULL,
          subject     TEXT        NOT NULL DEFAULT '',
          message     TEXT        NOT NULL,
          ip_hash     TEXT,
          user_agent  TEXT,
          is_read     BOOLEAN     NOT NULL DEFAULT FALSE,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`
      await q`CREATE INDEX IF NOT EXISTS contact_messages_ip_time ON contact_messages (ip_hash, created_at DESC)`
      await q`
        CREATE TABLE IF NOT EXISTS page_views (
          day   DATE    PRIMARY KEY,
          count INTEGER NOT NULL DEFAULT 0
        )`
    })().catch((err) => {
      schemaReady = null // retry on next request
      throw err
    })
  }
  await schemaReady
  return sql
}
