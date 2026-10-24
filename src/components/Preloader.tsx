import { animate, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { EASE, lockScroll, prefersReducedMotion } from '../lib/scroll'
import { Logo } from './ui/Logo'

/** Short branded intro: counts to 100 then lifts like a curtain. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    lockScroll(true)
    const quick = prefersReducedMotion()
    const controls = animate(0, 100, {
      duration: quick ? 0.2 : 1.5,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        setLeaving(true)
        lockScroll(false)
        onDone()
      },
    })
    return () => {
      controls.stop()
      lockScroll(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink-950 p-6 sm:p-10"
      initial={{ y: 0 }}
      animate={leaving ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 1, ease: EASE, delay: 0.1 }}
      style={{ pointerEvents: leaving ? 'none' : 'auto' }}
      aria-hidden
    >
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
        <span className="flex items-center gap-3 [--logo-bg:theme(colors.ink.950)]">
          <Logo className="h-7 w-7" />
          Housein Monzer
        </span>
        <span>Portfolio ©{new Date().getFullYear()}</span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <motion.p
          className="max-w-xs font-display text-lg text-slate-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Crafting digital experiences
          <br />
          <span className="text-white">with code & motion.</span>
        </motion.p>
        <span className="font-display text-[clamp(4rem,18vw,12rem)] font-semibold leading-none tracking-tighter text-white tabular-nums">
          {count}
          <span className="text-accent">%</span>
        </span>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-accent to-violet-500" style={{ width: `${count}%` }} />
    </motion.div>
  )
}
