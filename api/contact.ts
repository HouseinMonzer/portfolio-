import { contactSchema, fieldErrors } from '../shared/contact.js'
import { db } from './_lib/db.js'
import { clientIp, hashIp, json, memoryRateLimit, sameOrigin } from './_lib/http.js'
import { notifyWhatsApp, sendEmails } from './_lib/notify.js'

const LIMIT = 3 // messages
const WINDOW_MIN = 10 // per 10 minutes per IP

export async function POST(request: Request): Promise<Response> {
  if (!sameOrigin(request)) return json({ ok: false, error: 'Forbidden' }, 403)
  if (Number(request.headers.get('content-length') ?? 0) > 20_000) {
    return json({ ok: false, error: 'Payload too large' }, 413)
  }

  let raw: Record<string, unknown>
  try {
    raw = await request.json()
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400)
  }

  // Honeypot tripped → pretend success so bots learn nothing.
  if (typeof raw?.website === 'string' && raw.website.length > 0) return json({ ok: true })

  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    return json({ ok: false, error: 'Please fix the highlighted fields', fields: fieldErrors(parsed.error) }, 422)
  }
  const data = parsed.data
  const ipHash = hashIp(clientIp(request))

  let sql: Awaited<ReturnType<typeof db>> = null
  try {
    sql = await db()
  } catch (err) {
    console.error('[contact] database unavailable', err)
  }

  // Rate limit — durable when a DB exists, best-effort otherwise.
  if (sql) {
    const [{ n }] = (await sql`
      SELECT COUNT(*)::int AS n FROM contact_messages
      WHERE ip_hash = ${ipHash} AND created_at > NOW() - make_interval(mins => ${WINDOW_MIN})`) as { n: number }[]
    if (n >= LIMIT) return tooMany()
  } else if (!memoryRateLimit(ipHash, LIMIT, WINDOW_MIN * 60_000)) {
    return tooMany()
  }

  let id: number | undefined
  if (sql) {
    const rows = (await sql`
      INSERT INTO contact_messages (name, email, service, subject, message, ip_hash, user_agent)
      VALUES (${data.name}, ${data.email}, ${data.service}, ${data.subject}, ${data.message}, ${ipHash},
              ${(request.headers.get('user-agent') ?? '').slice(0, 300)})
      RETURNING id`) as { id: number }[]
    id = rows[0]?.id
  }

  let provider: Awaited<ReturnType<typeof sendEmails>> = 'none'
  try {
    provider = await sendEmails(data)
  } catch (err) {
    console.error('[contact] email provider failed', err)
    // Stored safely → still a success (visible in /admin). Otherwise let the client fall back.
    if (!id) return json({ ok: false, error: 'Email service unavailable', fallback: true }, 502)
  }

  if (!id && provider === 'none') {
    return json({ ok: false, error: 'Contact backend not configured', fallback: true }, 503)
  }

  await Promise.race([notifyWhatsApp(data), new Promise((r) => setTimeout(r, 3000))])
  return json({ ok: true, id })
}

function tooMany() {
  return json(
    { ok: false, error: `Too many messages — please try again in ${WINDOW_MIN} minutes.` },
    429,
    { 'retry-after': String(WINDOW_MIN * 60) },
  )
}
