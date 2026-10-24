import type { ContactData, ContactResponse } from '../../shared/contact'

/**
 * Sends the contact form to the backend (/api/contact). If the backend is not
 * deployed/configured, falls back to the browser EmailJS integration so the
 * form keeps working either way.
 */
export async function submitContact(data: ContactData): Promise<ContactResponse> {
  let res: Response
  try {
    res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    })
  } catch {
    return sendViaEmailJs(data)
  }

  const body = (await res.json().catch(() => null)) as ContactResponse | null
  if (body?.ok) return body
  if (!body || res.status === 404 || res.status === 405 || (!body.ok && body.fallback)) return sendViaEmailJs(data)
  return body
}

async function sendViaEmailJs(data: ContactData): Promise<ContactResponse> {
  const service = import.meta.env.VITE_EMAILJS_SERVICE
  const template = import.meta.env.VITE_EMAILJS_TEMPLATE
  const key = import.meta.env.VITE_EMAILJS_KEY
  if (!service || !template || !key) {
    return { ok: false, error: 'Messaging is temporarily unavailable — please email me directly.' }
  }
  try {
    const { default: emailjs } = await import('@emailjs/browser')
    const params = { from_name: data.name, from_email: data.email, subject: data.subject, message: data.message, to_name: 'Housein' }
    // Owner notification only. No auto-reply from the browser: it would let anyone use these
    // public keys to email arbitrary addresses, bypassing the server's validation and rate limit.
    await emailjs.send(service, template, params, key)
    return { ok: true }
  } catch (err) {
    console.error('EmailJS error', err)
    return { ok: false, error: 'Something went wrong sending your message — please try again or email me directly.' }
  }
}

/** Counts one visit per browser session and returns the running total (null if no DB). */
export async function trackVisit(): Promise<number | null> {
  try {
    let counted = false
    try {
      counted = sessionStorage.getItem('hm-visit') === '1'
      sessionStorage.setItem('hm-visit', '1')
    } catch {
      /* storage blocked */
    }
    const res = await fetch('/api/views', { method: counted ? 'GET' : 'POST' })
    if (!res.ok) return null
    const { views } = (await res.json()) as { views: number | null }
    return typeof views === 'number' ? views : null
  } catch {
    return null
  }
}
