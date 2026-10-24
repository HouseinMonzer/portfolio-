import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Download, Github, Linkedin, MapPin } from 'lucide-react'
import { personal } from '../data/portfolio'
import { EASE, scrollToId } from '../lib/scroll'
import { useLocalTime } from '../hooks/useLocalTime'
import { Magnetic } from './ui/Magnetic'
import { ErrorBoundary } from './ui/ErrorBoundary'

const HeroScene = lazy(() => import('./three/HeroScene'))

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

function Letters({ text, delay, className, show }: { text: string; delay: number; className?: string; show: boolean }) {
  return (
    <span className={`inline-block ${className ?? ''}`} aria-hidden>
      {text.split('').map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '115%' }}
            animate={{ y: show ? '0%' : '115%' }}
            transition={{ duration: 1.1, delay: delay + i * 0.045, ease: EASE }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

function RoleRotator({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % roles.length), 2800)
    return () => clearInterval(id)
  }, [roles.length])
  return (
    <span className="relative inline-flex h-[1.4em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={roles[i]}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-gradient whitespace-nowrap font-medium"
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const time = useLocalTime('Asia/Beirut')
  const [gl, setGl] = useState(false)
  const [visible, setVisible] = useState(true)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => setGl(webglAvailable()), [])

  // Pause the WebGL render loop while the hero is off-screen.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Intro animations are held until the preloader lifts (`ready`).
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.9, delay, ease: EASE },
  })
  const [first, last] = personal.name.split(' ')

  return (
    <section ref={ref} id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Background layers */}
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-accent/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-[120px]" />

      {gl && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 2, ease: EASE }}
          aria-hidden
        >
          <ErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <HeroScene frameloop={reduce ? 'demand' : visible ? 'always' : 'never'} />
            </Suspense>
          </ErrorBoundary>
        </motion.div>
      )}
      {/* Legibility scrim over the 3D on small screens */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/30 via-ink-950/40 to-ink-950 lg:bg-gradient-to-r lg:from-ink-950/80 lg:via-ink-950/20 lg:to-transparent" />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-x relative z-10 pb-24 pt-32">
        <motion.div
          {...fadeUp(0.1)}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] py-1.5 pl-2 pr-4 text-xs text-emerald-300 backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Available for freelance & full-time roles
        </motion.div>

        <h1 className="font-display text-[clamp(3.2rem,11vw,9.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white">
          <span className="sr-only">{personal.name}</span>
          <Letters text={first} delay={0.2} show={ready} />
          <br />
          <Letters text={last} delay={0.45} show={ready} className="text-gradient" />
        </h1>

        <motion.p
          {...fadeUp(0.9)}
          className="mt-8 flex flex-wrap items-baseline gap-x-3 font-display text-xl text-slate-300 sm:text-2xl lg:text-3xl"
        >
          <span>I'm a</span>
          <RoleRotator roles={personal.roles} />
        </motion.p>

        <motion.p
          {...fadeUp(1.05)}
          className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          I design and build fast, polished web products end-to-end — from pixel-perfect React interfaces to typed
          APIs and Postgres. Currently shipping <span className="text-white">SouQna</span>, a multi-vendor marketplace
          for Lebanon.
        </motion.p>

        <motion.div
          {...fadeUp(1.2)}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Magnetic>
            <button onClick={() => scrollToId('projects')} className="btn-primary group shadow-glow" data-cursor="View">
              See my work
              <ArrowDownRight size={16} className="transition-transform duration-300 group-hover:rotate-[-45deg]" />
            </button>
          </Magnetic>
          <Magnetic>
            <a href={personal.cv} download className="btn-ghost">
              <Download size={15} /> Download CV
            </a>
          </Magnetic>
          <button onClick={() => scrollToId('contact')} className="group inline-flex items-center gap-1.5 px-3 py-3 text-sm font-semibold text-slate-400 transition-colors hover:text-white">
            Let's talk <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom meta bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="container-x absolute inset-x-0 bottom-6 z-10 flex items-end justify-between gap-6 text-xs text-slate-500"
      >
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} className="text-accent" /> Beirut, {personal.location}
          </span>
          <span className="hidden font-mono sm:inline">{time} local</span>
        </div>

        <button onClick={() => scrollToId('about')} className="group hidden flex-col items-center gap-2 md:flex" aria-label="Scroll to About">
          <span className="font-mono uppercase tracking-[0.3em]">Scroll</span>
          <span className="relative h-10 w-px overflow-hidden bg-white/10">
            <motion.span
              className="absolute left-0 top-0 h-4 w-px bg-accent"
              animate={{ y: [-16, 40] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </button>

        <div className="flex items-center gap-2">
          {[
            { href: personal.github, icon: Github, label: 'GitHub' },
            { href: personal.linkedin, icon: Linkedin, label: 'LinkedIn' },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
