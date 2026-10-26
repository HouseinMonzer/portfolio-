import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowRight, Copy, CornerDownLeft, Download, Github, Hash, Linkedin, Mail, MessageSquare, Search, type LucideIcon } from 'lucide-react'
import { personal, sectionLinks } from '../data/portfolio'
import { discussProject } from '../lib/contactIntent'
import { lockScroll, scrollToId } from '../lib/scroll'

type Action = { id: string; label: string; group: string; icon: LucideIcon; hint?: string; run: () => void }

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const [toast, setToast] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const actions = useMemo<Action[]>(
    () => [
      ...sectionLinks.map((l) => ({ id: `go-${l.id}`, label: `Go to ${l.label}`, group: 'Navigate', icon: Hash, run: () => scrollToId(l.id) })),
      { id: 'discuss', label: 'Discuss a project', group: 'Actions', icon: MessageSquare, run: () => discussProject() },
      {
        id: 'copy-email',
        label: 'Copy email address',
        group: 'Actions',
        icon: Copy,
        hint: personal.email,
        run: () => {
          navigator.clipboard?.writeText(personal.email)
          setToast('Email copied to clipboard')
        },
      },
      { id: 'email', label: 'Send an email', group: 'Actions', icon: Mail, run: () => (window.location.href = `mailto:${personal.email}`) },
      {
        id: 'cv',
        label: 'Download CV',
        group: 'Actions',
        icon: Download,
        run: () => {
          const a = document.createElement('a')
          a.href = personal.cv
          a.download = ''
          a.click()
        },
      },
      { id: 'github', label: 'Open GitHub', group: 'Social', icon: Github, run: () => window.open(personal.github, '_blank', 'noopener') },
      { id: 'linkedin', label: 'Open LinkedIn', group: 'Social', icon: Linkedin, run: () => window.open(personal.linkedin, '_blank', 'noopener') },
    ],
    [],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? actions.filter((a) => `${a.label} ${a.group} ${a.hint ?? ''} ${a.id.replace(/-/g, ' ')}`.toLowerCase().includes(q)) : actions
  }, [actions, query])

  useEffect(() => {
    if (!open) return
    lockScroll(true)
    setQuery('')
    setIndex(0)
    const t = setTimeout(() => inputRef.current?.focus(), 30)
    return () => {
      clearTimeout(t)
      lockScroll(false)
    }
  }, [open])

  useEffect(() => setIndex(0), [query])
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [index])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const run = (a?: Action) => {
    if (!a) return
    onClose()
    setTimeout(a.run, 120)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => (i + 1) % Math.max(filtered.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(filtered[index])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  let lastGroup = ''
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[14vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={onClose} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-ink-850/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
              onKeyDown={onKeyDown}
            >
              <div className="flex items-center gap-3 border-b border-white/5 px-4">
                <Search size={16} className="text-slate-500" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search…"
                  className="h-14 flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                  aria-controls="cmdk-list"
                  aria-activedescendant={filtered[index] ? `cmdk-${filtered[index].id}` : undefined}
                />
                <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">ESC</kbd>
              </div>
              <ul ref={listRef} id="cmdk-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
                {filtered.length === 0 && <li className="px-3 py-8 text-center text-sm text-slate-500">No results for “{query}”</li>}
                {filtered.map((a, i) => {
                  const header = a.group !== lastGroup ? (lastGroup = a.group) : null
                  const Icon = a.icon
                  return (
                    <li key={a.id}>
                      {header && <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-slate-600">{header}</p>}
                      <button
                        id={`cmdk-${a.id}`}
                        role="option"
                        aria-selected={i === index}
                        data-index={i}
                        onMouseMove={() => setIndex(i)}
                        onClick={() => run(a)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${i === index ? 'bg-white/[0.06] text-white' : 'text-slate-400'}`}
                      >
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${i === index ? 'border-accent/40 text-accent' : 'border-white/5'}`}>
                          <Icon size={15} />
                        </span>
                        <span className="flex-1">{a.label}</span>
                        {a.hint && <span className="hidden text-xs text-slate-600 sm:block">{a.hint}</span>}
                        {i === index && (a.group === 'Navigate' ? <ArrowRight size={14} /> : <CornerDownLeft size={14} />)}
                      </button>
                    </li>
                  )
                })}
              </ul>
              <div className="flex items-center justify-between border-t border-white/5 px-4 py-2.5 font-mono text-[10px] text-slate-600">
                <span>↑↓ navigate · ↵ select</span>
                <span>{personal.name}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-[85] -translate-x-1/2 rounded-full border border-white/10 bg-ink-800 px-5 py-2.5 text-sm text-white shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
