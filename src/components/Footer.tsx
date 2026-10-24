import { useEffect, useState } from 'react'
import { ArrowUp, Eye, Github, Linkedin, Mail } from 'lucide-react'
import { navLinks, personal } from '../data/portfolio'
import { trackVisit } from '../lib/api'
import { scrollToId } from '../lib/scroll'
import { useLocalTime } from '../hooks/useLocalTime'
import { Logo } from './ui/Logo'
import { Magnetic } from './ui/Magnetic'

export default function Footer() {
  const [views, setViews] = useState<number | null>(null)
  const time = useLocalTime('Asia/Beirut')
  const year = new Date().getFullYear()

  useEffect(() => {
    trackVisit().then(setViews)
  }, [])

  return (
    <footer className="relative overflow-hidden border-t border-white/5 pt-20">
      <div className="container-x">
        <div className="grid gap-12 pb-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
              Have an idea? <br />
              <button onClick={() => scrollToId('contact')} className="text-gradient underline decoration-accent/30 underline-offset-8 transition-colors hover:decoration-accent">
                Let's make it real.
              </button>
            </p>
          </div>
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-slate-600">Menu</p>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <button onClick={() => scrollToId(l.id)} className="text-sm text-slate-400 transition-colors hover:text-white">{l.label}</button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-slate-600">Connect</p>
            <ul className="space-y-2 text-sm">
              <li><a href={personal.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-slate-400 hover:text-white"><Github size={14} /> GitHub</a></li>
              <li><a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-slate-400 hover:text-white"><Linkedin size={14} /> LinkedIn</a></li>
              <li><a href={`mailto:${personal.email}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white"><Mail size={14} /> Email</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/5 py-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p className="flex items-center gap-3 [--logo-bg:theme(colors.ink.950)]">
            <Logo className="h-6 w-6" />
            © {year} {personal.name}. Designed & built from scratch.
          </p>
          <div className="flex items-center gap-5">
            {views !== null && (
              <span className="inline-flex items-center gap-1.5" title="Total visits">
                <Eye size={13} className="text-accent" /> {views.toLocaleString()} visits
              </span>
            )}
            <span className="font-mono">Beirut {time}</span>
            <Magnetic>
              <button onClick={() => scrollToId('top')} aria-label="Back to top" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-colors hover:border-accent hover:bg-accent hover:text-ink-950">
                <ArrowUp size={16} />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Giant outlined wordmark */}
      <p aria-hidden className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[19vw] font-bold leading-[0.75] tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(148,163,184,0.12)]">
        MONZER
      </p>
    </footer>
  )
}
