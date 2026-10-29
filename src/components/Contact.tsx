import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AlertCircle, ArrowUpRight, Check, Copy, Linkedin, Loader2, Mail, Phone, Send } from 'lucide-react'
import { contactSchema, fieldErrors, type FieldErrors } from '../../shared/contact'
import { SERVICE_OPTIONS } from '../../shared/services'
import { personal } from '../data/portfolio'
import { submitContact } from '../lib/api'
import { onDiscussProject } from '../lib/contactIntent'
import { EASE } from '../lib/scroll'
import { Magnetic } from './ui/Magnetic'
import { Reveal, SplitWords } from './ui/Reveal'

type Status = 'idle' | 'loading' | 'success' | 'error'
const empty = { name: '', email: '', service: '', subject: '', message: '', website: '' }
const serviceGroups = [...new Set(SERVICE_OPTIONS.map((s) => s.group))]

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState('')
  const [copied, setCopied] = useState(false)
  const serviceRef = useRef<HTMLSelectElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  // "Discuss this" buttons elsewhere on the page preselect a service, then focus the next field
  // once the smooth scroll has landed.
  useEffect(
    () =>
      onDiscussProject(({ service, note }) => {
        setStatus((s) => (s === 'success' ? 'idle' : s))
        setForm((f) => ({ ...f, service: service || f.service, subject: f.subject || note }))
        setTimeout(() => (service ? messageRef : serviceRef).current?.focus({ preventScroll: true }), 1500)
      }),
    [],
  )

  const validate = (next = form) => {
    const r = contactSchema.safeParse(next)
    const errs = r.success ? {} : fieldErrors(r.error)
    setErrors(errs)
    return r
  }

  const update = (key: keyof typeof empty, value: string) => {
    const next = { ...form, [key]: value }
    setForm(next)
    if (touched[key]) validate(next)
  }

  const blur = (key: string) => {
    setTouched((t) => ({ ...t, [key]: true }))
    validate()
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, subject: true, message: true })
    const r = validate()
    if (!r.success) return
    setStatus('loading')
    setServerError('')
    const res = await submitContact(r.data)
    if (res.ok) {
      setStatus('success')
      setForm(empty)
      setTouched({})
    } else {
      setStatus('error')
      setServerError(res.error)
      if (res.fields) setErrors(res.fields)
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${personal.email}`
    }
  }

  const err = (k: keyof FieldErrors) => (touched[k] ? errors[k] : undefined)
  const remaining = 4000 - form.message.length

  return (
    <section id="contact" className="section overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-[140px]" />
      <div className="container-x relative">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Pitch */}
          <div className="lg:col-span-5">
            <Reveal y={16}>
              <p className="eyebrow mb-6"><span className="text-slate-500">09</span><span className="h-px w-10 bg-accent/50" />Contact</p>
            </Reveal>
            <h2 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              <SplitWords text="Let's make" />
              <br />
              <SplitWords text="something great." className="text-gradient" delay={0.15} />
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-slate-400">
                Need a website, product visuals for your store, a campaign for social media, or have a role to fill? Tell
                me about it. I usually reply within 24 hours.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 space-y-3">
                <button onClick={copyEmail} className="glass group flex w-full items-center gap-4 p-4 text-left transition-colors hover:border-accent/30" data-cursor="Copy">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Mail size={18} /></span>
                  <span className="flex-1">
                    <span className="block text-xs text-slate-500">Email</span>
                    <span className="text-sm text-white sm:text-base">{personal.email}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 transition-colors group-hover:text-accent">
                    {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                  </span>
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <a href={`tel:${personal.phone.replace(/\s/g, '')}`} className="glass group flex items-center gap-3 p-4 transition-colors hover:border-accent/30">
                    <Phone size={16} className="text-accent" />
                    <span className="text-sm text-slate-300 group-hover:text-white">Call / WhatsApp</span>
                  </a>
                  <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="glass group flex items-center gap-3 p-4 transition-colors hover:border-accent/30">
                    <Linkedin size={16} className="text-accent" />
                    <span className="flex-1 text-sm text-slate-300 group-hover:text-white">LinkedIn</span>
                    <ArrowUpRight size={14} className="text-slate-500" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.15} className="lg:col-span-7">
            <div className="glass relative overflow-hidden p-6 sm:p-10">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex min-h-[460px] flex-col items-center justify-center text-center"
                    role="status"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-ink-950 shadow-glow"
                    >
                      <Check size={36} strokeWidth={2.5} />
                    </motion.span>
                    <h3 className="mt-8 font-display text-3xl font-semibold text-white">Message received!</h3>
                    <p className="mt-3 max-w-sm text-slate-400">Thanks for reaching out. I'll get back to you within 24 hours.</p>
                    <button onClick={() => setStatus('idle')} className="btn-ghost mt-8">Send another message</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0 }} className="space-y-5">
                    {/* Honeypot */}
                    <div className="absolute -left-[9999px]" aria-hidden>
                      <label>
                        Website <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} />
                      </label>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field id="name" label="Your name" error={err('name')}>
                        <input id="name" className="field" autoComplete="name" placeholder="Jane Doe" value={form.name} onChange={(e) => update('name', e.target.value)} onBlur={() => blur('name')} aria-invalid={!!err('name')} aria-describedby={err('name') ? 'name-error' : undefined} />
                      </Field>
                      <Field id="email" label="Email address" error={err('email')}>
                        <input id="email" type="email" className="field" autoComplete="email" placeholder="jane@company.com" value={form.email} onChange={(e) => update('email', e.target.value)} onBlur={() => blur('email')} aria-invalid={!!err('email')} aria-describedby={err('email') ? 'email-error' : undefined} />
                      </Field>
                    </div>

                    <Field id="service" label="What do you need?" optional error={err('service')}>
                      <select id="service" ref={serviceRef} className="field [&>optgroup]:bg-ink-900 [&_option]:bg-ink-900" value={form.service} onChange={(e) => update('service', e.target.value)} onBlur={() => blur('service')}>
                        <option value="">Choose a service</option>
                        {serviceGroups.map((g) => (
                          <optgroup key={g} label={g}>
                            {SERVICE_OPTIONS.filter((s) => s.group === g).map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                          </optgroup>
                        ))}
                      </select>
                    </Field>

                    <Field id="subject" label="Subject" optional error={err('subject')}>
                      <input id="subject" className="field" placeholder="Product shoot, new website, job opportunity…" value={form.subject} onChange={(e) => update('subject', e.target.value)} onBlur={() => blur('subject')} />
                    </Field>

                    <Field id="message" label="Project details" error={err('message')} hint={form.message ? `${remaining} left` : undefined}>
                      <textarea id="message" ref={messageRef} rows={6} className="field resize-none" placeholder="What you need, for which product or brand, sizes or platforms, timeline and budget…" value={form.message} onChange={(e) => update('message', e.target.value)} onBlur={() => blur('message')} maxLength={4000} aria-invalid={!!err('message')} aria-describedby={err('message') ? 'message-error' : undefined} data-lenis-prevent />
                    </Field>

                    <div role="alert" aria-live="assertive">
                      <AnimatePresence>
                        {status === 'error' && serverError && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            <AlertCircle size={16} className="shrink-0" /> {serverError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex flex-col-reverse items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                      <p className="text-xs text-slate-500">Protected against spam. Your details are never shared.</p>
                      <Magnetic>
                        <button type="submit" disabled={status === 'loading'} className="btn-primary group min-w-[180px] disabled:cursor-wait disabled:opacity-70">
                          {status === 'loading' ? (
                            <><Loader2 size={16} className="animate-spin" /> Sending…</>
                          ) : (
                            <>Send message <Send size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" /></>
                          )}
                        </button>
                      </Magnetic>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Field({ id, label, error, optional, hint, children }: { id: string; label: string; error?: string; optional?: boolean; hint?: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm text-slate-300">
          {label} {optional && <span className="text-slate-600">(optional)</span>}
        </label>
        {hint && <span className="font-mono text-[10px] text-slate-600">{hint}</span>}
      </div>
      <div className={error ? '[&_.field]:border-red-500/50' : ''}>{children}</div>
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-error`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-xs text-red-400">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
