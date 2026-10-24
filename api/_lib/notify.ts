import type { ContactData } from '../../shared/contact.js'

const env = (...keys: string[]) => keys.map((k) => process.env[k]).find(Boolean) ?? ''

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export function emailConfigured(): boolean {
  return Boolean(env('RESEND_API_KEY') || (env('EMAILJS_SERVICE_ID', 'VITE_EMAILJS_SERVICE') && env('EMAILJS_TEMPLATE_ID', 'VITE_EMAILJS_TEMPLATE') && env('EMAILJS_PUBLIC_KEY', 'VITE_EMAILJS_KEY')))
}

/** Sends the owner notification (+ optional auto-reply). Throws if the provider rejects it. */
export async function sendEmails(data: ContactData): Promise<'resend' | 'emailjs' | 'none'> {
  if (env('RESEND_API_KEY')) {
    await resend(data)
    return 'resend'
  }
  if (emailConfigured()) {
    await emailjs(data)
    return 'emailjs'
  }
  return 'none'
}

async function resend(data: ContactData) {
  const key = env('RESEND_API_KEY')
  const to = env('CONTACT_TO_EMAIL') || 'houseinmonzer@proton.me'
  const from = env('CONTACT_FROM_EMAIL') || 'Portfolio <onboarding@resend.dev>'
  const send = (payload: Record<string, unknown>) =>
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })

  const subject = data.subject || `New message from ${data.name}`
  const res = await send({
    from,
    to: [to],
    reply_to: data.email,
    subject: `📬 ${subject}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px">
        <h2 style="margin:0 0 12px">New portfolio message</h2>
        <p><b>From:</b> ${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</p>
        ${data.subject ? `<p><b>Subject:</b> ${escapeHtml(data.subject)}</p>` : ''}
        <div style="padding:16px;background:#f4f6fa;border-radius:12px;white-space:pre-wrap">${escapeHtml(data.message)}</div>
      </div>`,
  })
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)

  // Auto-reply only works once a sending domain is verified; never fail the request on it.
  if (env('CONTACT_AUTOREPLY') === 'true') {
    send({
      from,
      to: [data.email],
      subject: 'Thanks for reaching out — Housein Monzer',
      html: `<p>Hi ${escapeHtml(data.name)},</p><p>Thanks for your message! I've received it and will get back to you within 24–48 hours.</p><p>— Housein</p>`,
    }).catch(() => {})
  }
}

async function emailjs(data: ContactData) {
  // Requires "Allow EmailJS API for non-browser applications" in EmailJS → Account → Security.
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      service_id: env('EMAILJS_SERVICE_ID', 'VITE_EMAILJS_SERVICE'),
      template_id: env('EMAILJS_TEMPLATE_ID', 'VITE_EMAILJS_TEMPLATE'),
      user_id: env('EMAILJS_PUBLIC_KEY', 'VITE_EMAILJS_KEY'),
      accessToken: env('EMAILJS_PRIVATE_KEY') || undefined,
      template_params: {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
        to_name: 'Housein',
      },
    }),
  })
  if (!res.ok) throw new Error(`EmailJS ${res.status}: ${await res.text()}`)
}

/** Optional WhatsApp ping via CallMeBot — key now lives server-side only. */
export function notifyWhatsApp(data: ContactData): Promise<void> {
  const key = env('CALLMEBOT_KEY')
  const phone = env('CALLMEBOT_PHONE') || '96181960352'
  if (!key) return Promise.resolve()
  const text = encodeURIComponent(`📬 New portfolio message\n\nFrom: ${data.name}\nEmail: ${data.email}\n\n${data.message.slice(0, 250)}`)
  return fetch(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${text}&apikey=${key}`)
    .then(() => undefined)
    .catch(() => undefined)
}
