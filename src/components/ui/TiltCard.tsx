import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, type ReactNode, type PointerEvent } from 'react'

type Props = { children: ReactNode; className?: string; max?: number; as?: 'div' | 'article' }

/**
 * 3D perspective tilt that follows the cursor, plus --mx/--my CSS vars that
 * drive the `.spotlight` glow. Touch devices get a static card.
 */
export function TiltCard({ children, className = '', max = 8, as = 'div' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 180, damping: 18, mass: 0.5 }
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    px.set(x)
    py.set(y)
    ref.current.style.setProperty('--mx', `${x * 100}%`)
    ref.current.style.setProperty('--my', `${y * 100}%`)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  const Comp = as === 'article' ? motion.article : motion.div
  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <Comp
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`glass spotlight h-full will-change-transform ${className}`}
      >
        {children}
      </Comp>
    </div>
  )
}
