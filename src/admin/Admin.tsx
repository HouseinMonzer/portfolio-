import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowLeft, Eye, Inbox, Loader2, LogOut, Mail, MailOpen, RefreshCw, Search, ShieldCheck, Trash2 } from 'lucide-react'
import { Logo } from '../components/ui/Logo'

type Message = { id: number; name: string; email: string; subject: string; message: string; is_read: boolean; created_at: string }
type Stats = { total: number; unread: number; week: number; views: number; views_week: number }
type Payload = { messages: Message[]; stats: Stats; daily: { day: string; count: number }[] }
type Health = { services: Record<string, boolean> }

const TOKEN_KEY = 'hm-admin-token'
const readToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY) ?? ''
  } catch {
    return ''
  }
}

export default function Admin() {
  const [token, setToken] = useState(readToken)
  const [data, setData] = useState<Payload | null>(null)
  const [health, setHealth] = useState<Health | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<number | null>(null)

  useEffect(() => {
    document.title = 'Dashboard · Housein Monzer'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    fetch('/api/health').then((r) => r.json()).then(setHealth).catch(() => {})
  }, [])

  const api = useCallback(
    async (method: string, body?: unknown, qs = '') => {
      const res = await fetch(`/api/admin/messages${qs}`, {
        method,
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      })
      const json = await res.json().catch(() => ({}))
      if (res.status === 401) {
        logout()
        throw new Error('Invalid admin token')
      }
      if (!res.ok) throw new Error(json.error ?? `Request failed (${res.status})`)
      return json
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token],
  )

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      setData(await api('GET'))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [api, token])

  useEffect(() => {
    load()
  }, [load])

  function logout() {
    try {
      sessionStorage.removeItem(TOKEN_KEY)
    } catch {
      /* ignore */
    }
    setToken('')
    setData(null)
  }

  const toggleRead = async (m: Message, is_read = !m.is_read) => {
    setData((d) => d && { ...d, messages: d.messages.map((x) => (x.id === m.id ? { ...x, is_read } : x)), stats: { ...d.stats, unread: d.stats.unread + (is_read ? -1 : 1) } })
    await api('PATCH', { id: m.id, is_read }).catch((e) => setError(e.message))
  }

  const remove = async (m: Message) => {
    if (!confirm(`Delete the message from ${m.name}? This cannot be undone.`)) return
    await api('DELETE', undefined, `?id=${m.id}`)
      .then(() => setData((d) => d && { ...d, messages: d.messages.filter((x) => x.id !== m.id), stats: { ...d.stats, total: d.stats.total - 1, unread: d.stats.unread - (m.is_read ? 0 : 1) } }))
      .catch((e) => setError(e.message))
  }

  const open = (m: Message) => {
    setOpenId(openId === m.id ? null : m.id)
    if (!m.is_read) toggleRead(m, true)
  }

  const visible = useMemo(() => {
    const q = query.toLowerCase()
    return (data?.messages ?? []).filter((m) => (filter === 'all' || !m.is_read) && (!q || `${m.name} ${m.email} ${m.subject} ${m.message}`.toLowerCase().includes(q)))
  }, [data, filter, query])

  if (!token) return <Login onToken={setToken} health={health} />

  const maxDaily = Math.max(1, ...(data?.daily.map((d) => d.count) ?? [1]))

  return (
    <div className="min-h-screen bg-ink-950 text-slate-200">
      <header className="sticky top-0 z-10 border-b border-white/5 bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-ink-900 [--logo-bg:theme(colors.ink.900)]">
              <Logo className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-white">Dashboard</p>
              <p className="text-xs text-slate-500">Portfolio backend</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="hidden items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:text-white sm:inline-flex"><ArrowLeft size={13} /> Site</a>
            <button onClick={load} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:text-white" aria-label="Refresh">
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={logout} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:text-white"><LogOut size={13} /> Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {[
            { label: 'Messages', value: data?.stats.total, icon: Inbox },
            { label: 'Unread', value: data?.stats.unread, icon: Mail, accent: true },
            { label: 'Last 7 days', value: data?.stats.week, icon: MailOpen },
            { label: 'Total visits', value: data?.stats.views, icon: Eye },
            { label: 'Visits (7d)', value: data?.stats.views_week, icon: Eye },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div key={label} className="glass p-5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                {label} <Icon size={14} className={accent ? 'text-accent' : ''} />
              </div>
              <p className={`mt-3 font-display text-3xl font-semibold tabular-nums ${accent && value ? 'text-accent' : 'text-white'}`}>{value ?? '—'}</p>
            </div>
          ))}
        </div>

        {/* Traffic chart */}
        <div className="glass p-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="font-display text-white">Visits · last 14 days</p>
            {health && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(health.services).map(([k, on]) => (
                  <span key={k} className={`chip ${on ? '!border-emerald-400/30 !text-emerald-300' : '!text-slate-500'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-emerald-400' : 'bg-slate-600'}`} /> {k}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex h-40 items-end gap-1.5">
            {(data?.daily ?? Array.from({ length: 14 }, (_, i) => ({ day: String(i), count: 0 }))).map((d, i) => (
              <div key={d.day} className="group relative flex h-full flex-1 flex-col justify-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(2, (d.count / maxDaily) * 100)}%` }}
                  transition={{ delay: i * 0.03, duration: 0.6 }}
                  className="rounded-t-md bg-gradient-to-t from-accent/30 to-accent group-hover:to-white"
                />
                <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink-700 px-2 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100">
                  {d.count} · {d.day.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Inbox */}
        <div className="glass overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1 rounded-full border border-white/5 bg-white/[0.02] p-1 text-xs">
              {(['all', 'unread'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 capitalize ${filter === f ? 'bg-white text-ink-950' : 'text-slate-400 hover:text-white'}`}>
                  {f}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm">
              <Search size={14} className="text-slate-500" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search messages" className="w-full bg-transparent text-white placeholder-slate-600 outline-none sm:w-56" />
            </label>
          </div>

          {loading && !data ? (
            <div className="flex justify-center py-16 text-slate-500"><Loader2 className="animate-spin" /></div>
          ) : visible.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">{data ? 'No messages here yet.' : 'Could not load messages.'}</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {visible.map((m) => (
                <li key={m.id}>
                  <button onClick={() => open(m)} className="flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-white/[0.02] sm:px-6">
                    <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${m.is_read ? 'bg-transparent' : 'bg-accent'}`} />
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 font-display text-sm text-white">{m.name[0]?.toUpperCase()}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className={`truncate ${m.is_read ? 'text-slate-300' : 'font-semibold text-white'}`}>{m.name}</span>
                        <span className="shrink-0 text-xs text-slate-500">{new Date(m.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </span>
                      <span className="block truncate text-sm text-slate-500">{m.subject || m.message}</span>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openId === m.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="space-y-4 px-4 pb-6 sm:pl-[4.75rem] sm:pr-6">
                          <p className="text-xs text-slate-500">{m.email}{m.subject && <> · <span className="text-slate-300">{m.subject}</span></>}</p>
                          <p className="whitespace-pre-wrap rounded-2xl bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-200">{m.message}</p>
                          <div className="flex flex-wrap gap-2">
                            <a href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.subject || 'Your message'))}`} className="btn-primary !px-4 !py-2 !text-xs"><Mail size={13} /> Reply</a>
                            <button onClick={() => toggleRead(m)} className="btn-ghost !px-4 !py-2 !text-xs">{m.is_read ? 'Mark unread' : 'Mark read'}</button>
                            <button onClick={() => remove(m)} className="btn-ghost !px-4 !py-2 !text-xs hover:!border-red-500/50 hover:!text-red-400"><Trash2 size={13} /> Delete</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}

function Login({ onToken, health }: { onToken: (t: string) => void; health: Health | null }) {
  const [value, setValue] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setChecking(true)
    setError('')
    const res = await fetch('/api/admin/messages', { headers: { authorization: `Bearer ${value}` } }).catch(() => null)
    setChecking(false)
    if (res?.status === 401) return setError('That token is not valid.')
    if (!res || (!res.ok && res.status !== 503)) return setError('Backend unreachable. Is /api deployed?')
    try {
      sessionStorage.setItem(TOKEN_KEY, value)
    } catch {
      /* ignore */
    }
    onToken(value)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <form onSubmit={submit} className="glass w-full max-w-sm p-8">
        <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent"><ShieldCheck size={22} /></span>
        <h1 className="font-display text-2xl font-semibold text-white">Admin access</h1>
        <p className="mt-2 text-sm text-slate-400">Enter the <code className="text-accent">ADMIN_TOKEN</code> configured on the server.</p>
        <input type="password" autoFocus value={value} onChange={(e) => setValue(e.target.value)} className="field mt-6" placeholder="Admin token" aria-label="Admin token" />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        {health && !health.services.admin && <p className="mt-3 text-xs text-amber-300">ADMIN_TOKEN is not set on the server yet (min. 12 characters).</p>}
        <button disabled={!value || checking} className="btn-primary mt-6 w-full disabled:opacity-50">
          {checking ? <Loader2 size={16} className="animate-spin" /> : 'Sign in'}
        </button>
        <a href="/" className="mt-4 block text-center text-xs text-slate-500 hover:text-white">← Back to site</a>
      </form>
    </div>
  )
}
