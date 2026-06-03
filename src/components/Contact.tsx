import { useState } from 'react'
import type { RefObject, FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { Mail, Phone, MapPin, Linkedin, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { personal } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

// ── EmailJS config ──────────────────────────────
// Fill these after setup (see instructions below)
const EJS_SERVICE  = import.meta.env.VITE_EMAILJS_SERVICE  ?? ''
const EJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE ?? ''
const EJS_KEY      = import.meta.env.VITE_EMAILJS_KEY      ?? ''

// ── CallMeBot WhatsApp config ───────────────────
const WA_NUMBER  = '96181960352'
const WA_APIKEY  = import.meta.env.VITE_CALLMEBOT_KEY ?? ''

type Status = 'idle' | 'loading' | 'success' | 'error'

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&')

export default function Contact() {
  const { ref, inView } = useInView()
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const notifyWhatsApp = (name: string, email: string, msg: string) => {
    if (!WA_APIKEY) return
    const text = encodeURIComponent(
      `📬 New Portfolio Message!\n\nFrom: ${name}\nEmail: ${email}\n\n${msg.slice(0, 250)}`
    )
    fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${WA_NUMBER}&text=${text}&apikey=${WA_APIKEY}`,
      { mode: 'no-cors' }
    ).catch(() => {})
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const params = {
        from_name:  form.name,
        from_email: form.email,
        message:    form.message,
        to_name:    'Housein',
      }

      // Email 1 → Housein (notification) — must succeed
      await emailjs.send(EJS_SERVICE, EJS_TEMPLATE, params, EJS_KEY)

      // Email 2 → Client (thank you) — optional, don't fail if it errors
      emailjs.send(EJS_SERVICE, 'template_rucx4ys', params, EJS_KEY)
        .catch((err) => console.warn('Thank-you email failed:', err))

      // Mirror submission to Netlify Forms so it shows up in the Netlify dashboard.
      // Non-blocking: if Netlify is unreachable, the EmailJS path still succeeded.
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'contact',
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      }).catch((err) => console.warn('Netlify Forms submission failed:', err))

      notifyWhatsApp(form.name, form.email, form.message)
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <section id="contact" className="section-padding">
      <div
        ref={ref as RefObject<HTMLDivElement>}
        className={`max-container transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
          Get In <span className="gradient-text">Touch</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-10" />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* ── Info ── */}
          <div>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              I'm currently open to new opportunities in web development and IT support. Whether
              you have a project in mind or just want to connect — my inbox is always open.
            </p>
            <div className="space-y-4">
              {[
                { icon: Mail,     label: 'Email',    value: personal.email,       href: `mailto:${personal.email}` },
                { icon: Phone,    label: 'Phone',    value: personal.phone,       href: `tel:${personal.phone}` },
                { icon: MapPin,   label: 'Location', value: personal.location,    href: null },
                { icon: Linkedin, label: 'LinkedIn', value: 'Housein Monzer',     href: personal.linkedin },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-0.5">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-slate-200 hover:text-cyan-400 transition-colors text-sm"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-slate-200 text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Form ── */}
          <form
            onSubmit={handleSubmit}
            name="contact"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            className="space-y-4"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p hidden>
              <label>
                Don&apos;t fill this out: <input name="bot-field" />
              </label>
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-slate-400 text-sm mb-1.5">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-navy-800/60 border border-slate-700 hover:border-slate-600 focus:border-cyan-500 focus:outline-none rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 text-sm transition-colors"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-slate-400 text-sm mb-1.5">Your Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full bg-navy-800/60 border border-slate-700 hover:border-slate-600 focus:border-cyan-500 focus:outline-none rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-slate-400 text-sm mb-1.5">Message</label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about your project or opportunity..."
                className="w-full bg-navy-800/60 border border-slate-700 hover:border-slate-600 focus:border-cyan-500 focus:outline-none rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 text-sm transition-colors resize-none"
              />
            </div>

            {/* Status message */}
            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2.5">
                <CheckCircle size={16} />
                Message sent! I'll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">
                <AlertCircle size={16} />
                Failed to send. Please try again or email me directly.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
            >
              {status === 'loading' ? (
                <><Loader size={18} className="animate-spin" /> Sending…</>
              ) : status === 'success' ? (
                <><CheckCircle size={18} /> Sent!</>
              ) : (
                <><Send size={18} /> Send Message</>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
