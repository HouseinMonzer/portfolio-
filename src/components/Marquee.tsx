import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const items = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AI Product Photography', 'Three.js', 'Social Media Ads', 'TailwindCSS', 'Shopify Visuals', 'WordPress', 'Storyboards', 'Figma']

/** Two counter-scrolling bands of the stack, skewed by scroll position. */
export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3])
  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-15%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['-15%', '0%'])

  const row = (
    <>
      {[...items, ...items].map((t, i) => (
        <span key={i} className="flex items-center gap-8 px-4">
          <span>{t}</span>
          <span className="text-accent">✦</span>
        </span>
      ))}
    </>
  )

  return (
    <div ref={ref} aria-hidden className="relative overflow-hidden py-10">
      <motion.div style={{ rotate }} className="space-y-3">
        <motion.div style={{ x: x1 }} className="border-y border-white/5 bg-white/[0.02] py-4">
          <div className="flex w-max animate-marquee whitespace-nowrap font-display text-2xl font-medium text-slate-300 sm:text-4xl">{row}</div>
        </motion.div>
        <motion.div style={{ x: x2 }} className="py-1">
          <div className="flex w-max animate-marquee whitespace-nowrap font-display text-2xl font-medium text-transparent [-webkit-text-stroke:1px_rgba(148,163,184,0.35)] [animation-direction:reverse] sm:text-4xl">
            {row}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
