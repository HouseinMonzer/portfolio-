import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Command, Menu, X } from 'lucide-react'
import { navLinks, personal } from '../data/portfolio'
import { EASE, lockScroll, scrollToId } from '../lib/scroll'
import { Logo } from './ui/Logo'

export default function Navbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('hero')
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  // Hide on scroll down, reveal on scroll up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > prev && y > 400 && !open)
  })

  // Scroll-spy
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ;['hero', ...navLinks.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    lockScroll(true)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    setTimeout(() => scrollToId(id), open ? 350 : 0)
  }

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 ${
            scrolled || open ? 'border-white/10 bg-ink-900/70 shadow-card backdrop-blur-xl' : 'border-transparent bg-transparent'
          }`}
        >
          <button onClick={() => go('top')} className="group flex items-center gap-2.5 pl-2" aria-label="Back to top">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-ink-900 shadow-[0_0_0_0_rgba(34,211,238,0)] transition-shadow duration-300 [--logo-bg:theme(colors.ink.900)] group-hover:shadow-glow">
              <Logo className="h-7 w-7" />
            </span>
            <span className="hidden font-display text-sm font-medium text-white sm:block">
              {personal.name}
            </span>
          </button>

          <ul className="hidden items-center gap-1 rounded-full border border-white/5 bg-white/[0.03] p-1 lg:flex">
            {navLinks.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  aria-current={active === l.id ? 'true' : undefined}
                  className={`relative rounded-full px-4 py-1.5 text-sm transition-colors ${active === l.id ? 'text-ink-950' : 'text-slate-400 hover:text-white'}`}
                >
                  {active === l.id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative">{l.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPalette}
              className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-white/20 hover:text-white sm:flex"
              aria-label="Open command menu"
            >
              <Command size={13} />
              <kbd className="font-mono">{isMac ? '⌘' : 'Ctrl'} K</kbd>
            </button>
            <button onClick={() => go('contact')} className="hidden rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-white sm:block">
              Hire me
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink-900 px-6 pb-10 pt-28 lg:hidden"
          >
            <ul className="space-y-2">
              {navLinks.map((l, i) => (
                <motion.li key={l.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05, ease: EASE, duration: 0.6 }}>
                  <button onClick={() => go(l.id)} className="flex w-full items-baseline gap-4 py-2 text-left">
                    <span className="font-mono text-xs text-accent">0{i + 1}</span>
                    <span className={`font-display text-4xl font-medium ${active === l.id ? 'text-white' : 'text-slate-400'}`}>{l.label}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-col gap-1 text-sm text-slate-400">
              <a href={`mailto:${personal.email}`} className="hover:text-white">{personal.email}</a>
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn ↗</a>
              <a href={personal.github} target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub ↗</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
