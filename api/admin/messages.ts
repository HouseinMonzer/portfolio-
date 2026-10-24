import { db } from '../_lib/db.js'
import { isAdmin, json } from '../_lib/http.js'

export type AdminMessage = {
  id: number
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

/** Returns the SQL client, or an error Response to send back as-is. */
async function guard(request: Request) {
  if (!isAdmin(request)) return json({ error: 'Unauthorized' }, 401)
  return (await db()) ?? json({ error: 'DATABASE_URL is not configured' }, 503)
}

/** GET /api/admin/messages → latest messages + dashboard stats. */
export async function GET(request: Request): Promise<Response> {
  const sql = await guard(request)
  if (sql instanceof Response) return sql

  const messages = (await sql`
    SELECT id, name, email, subject, message, is_read, created_at
    FROM contact_messages ORDER BY created_at DESC LIMIT 200`) as AdminMessage[]
  const [stats] = (await sql`
    SELECT
      (SELECT COUNT(*)::int FROM contact_messages)                                   AS total,
      (SELECT COUNT(*)::int FROM contact_messages WHERE NOT is_read)                 AS unread,
      (SELECT COUNT(*)::int FROM contact_messages WHERE created_at > NOW() - INTERVAL '7 days') AS week,
      (SELECT COALESCE(SUM(count), 0)::int FROM page_views)                          AS views,
      (SELECT COALESCE(SUM(count), 0)::int FROM page_views WHERE day > CURRENT_DATE - 7) AS views_week`) as Record<string, number>[]
  const daily = (await sql`
    SELECT to_char(d, 'YYYY-MM-DD') AS day, COALESCE(p.count, 0)::int AS count
    FROM generate_series(CURRENT_DATE - 13, CURRENT_DATE, INTERVAL '1 day') AS d
    LEFT JOIN page_views p ON p.day = d::date ORDER BY d`) as { day: string; count: number }[]

  return json({ messages, stats, daily })
}

/** PATCH /api/admin/messages  { id, is_read } */
export async function PATCH(request: Request): Promise<Response> {
  const sql = await guard(request)
  if (sql instanceof Response) return sql
  const body = (await request.json().catch(() => ({}))) as { id?: unknown; is_read?: unknown }
  if (!Number.isInteger(body.id) || typeof body.is_read !== 'boolean') return json({ error: 'Bad request' }, 400)
  await sql`UPDATE contact_messages SET is_read = ${body.is_read} WHERE id = ${body.id as number}`
  return json({ ok: true })
}

/** DELETE /api/admin/messages?id=123 */
export async function DELETE(request: Request): Promise<Response> {
  const sql = await guard(request)
  if (sql instanceof Response) return sql
  const id = Number(new URL(request.url).searchParams.get('id'))
  if (!Number.isInteger(id) || id <= 0) return json({ error: 'Bad request' }, 400)
  await sql`DELETE FROM contact_messages WHERE id = ${id}`
  return json({ ok: true })
}
