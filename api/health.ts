import { hasDb } from './_lib/db.js'
import { json } from './_lib/http.js'
import { emailConfigured } from './_lib/notify.js'

export function GET(): Response {
  return json({
    ok: true,
    time: new Date().toISOString(),
    services: {
      database: hasDb(),
      email: emailConfigured(),
      whatsapp: Boolean(process.env.CALLMEBOT_KEY),
      admin: Boolean(process.env.ADMIN_TOKEN && process.env.ADMIN_TOKEN.length >= 12),
    },
  })
}
