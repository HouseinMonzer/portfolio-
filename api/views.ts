import { db } from './_lib/db.js'
import { clientIp, hashIp, json, memoryRateLimit, sameOrigin } from './_lib/http.js'

async function total(): Promise<number | null> {
  const sql = await db()
  if (!sql) return null
  const [{ total }] = (await sql`SELECT COALESCE(SUM(count), 0)::int AS total FROM page_views`) as { total: number }[]
  return total
}

/** GET → total visits (cached briefly at the edge). */
export async function GET(): Promise<Response> {
  try {
    return json({ views: await total() }, 200, { 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' })
  } catch (err) {
    console.error('[views] read failed', err)
    return json({ views: null })
  }
}

/** POST → count one visit (client sends this once per browser session). */
export async function POST(request: Request): Promise<Response> {
  if (!sameOrigin(request)) return json({ views: null }, 403)
  try {
    const sql = await db()
    if (!sql) return json({ views: null })
    // Cap how often one IP can bump the counter.
    if (memoryRateLimit(`view:${hashIp(clientIp(request))}`, 5, 60 * 60_000)) {
      await sql`
        INSERT INTO page_views (day, count) VALUES (CURRENT_DATE, 1)
        ON CONFLICT (day) DO UPDATE SET count = page_views.count + 1`
    }
    return json({ views: await total() })
  } catch (err) {
    console.error('[views] write failed', err)
    return json({ views: null })
  }
}
