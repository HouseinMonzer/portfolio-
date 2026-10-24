import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Custom cursor for fine pointers: a dot + a lagging ring that grows over
 * interactive elements and shows a label for elements with data-cursor="…".
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [hover, setHover] = useState(false)
  const [label, setLabel] = useState('')
  const [hidden, setHidden] = useState(true)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine) return
    setEnabled(true)
    document.body.classList.add('has-cursor')

    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHidden(false)
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('a, button, [data-cursor], input, textarea, select, label')
      setHover(Boolean(target) && !['INPUT', 'TEXTAREA'].includes(target?.tagName ?? ''))
      setLabel(target?.dataset.cursor ?? '')
    }
    const leave = () => setHidden(true)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [x, y])

  if (!enabled) return null
  const size = label ? 84 : hover ? 52 : 34

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]" style={{ opacity: hidden ? 0 : 1, transition: 'opacity .3s' }}>
      <motion.div className="absolute left-0 top-0" style={{ x: rx, y: ry }}>
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
          animate={{
            width: size,
            height: size,
            backgroundColor: label ? 'rgba(34,211,238,0.95)' : hover ? 'rgba(34,211,238,0.08)' : 'rgba(0,0,0,0)',
            borderColor: label ? 'rgba(34,211,238,0)' : hover ? 'rgba(34,211,238,0.6)' : 'rgba(255,255,255,0.25)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {label && <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-950">{label}</span>}
        </motion.div>
      </motion.div>
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" style={{ opacity: label ? 0 : 1 }} />
      </motion.div>
    </div>
  )
}
