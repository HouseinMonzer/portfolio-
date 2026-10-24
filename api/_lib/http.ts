import { createHash, timingSafeEqual } from 'node:crypto'

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  })
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for')
  return (fwd?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown').trim()
}

/** One-way hash so raw IPs are never stored. */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? 'portfolio'
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}

/** Reject cross-site form posts: Origin (when present) must match the Host. */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).host === (request.headers.get('x-forwarded-host') ?? request.headers.get('host'))
  } catch {
    return false
  }
}

/** Constant-time bearer token check for admin endpoints. */
export function isAdmin(request: Request): boolean {
  const expected = process.env.ADMIN_TOKEN
  if (!expected || expected.length < 12) return false
  const given = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

// Best-effort in-memory limiter used when there is no database (per warm instance).
const hits = new Map<string, number[]>()
export function memoryRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) hits.clear()
  return true
}
