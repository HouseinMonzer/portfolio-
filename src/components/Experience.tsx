import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { experience } from '../data/portfolio'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="experience" className="section">
      <div className="container-x">
        <SectionHeading index="03" eyebrow="Experience" title="Where I've been" accent="making things.">
          Agency delivery and independent client work: shipping real products for real businesses.
        </SectionHeading>

        <div ref={ref} className="relative">
          {/* Track + scroll-drawn progress line */}
          <div className="absolute bottom-0 left-[7px] top-2 w-px bg-white/10 md:left-[calc(30%+7px)]" />
          <motion.div style={{ scaleY }} className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-accent via-sky-400 to-violet-500 md:left-[calc(30%+7px)]" />

          <div className="space-y-16">
            {experience.map((job, i) => (
              <div key={job.role + job.company} className="relative grid gap-6 pl-10 md:grid-cols-[30%_1fr] md:gap-12 md:pl-0">
                {/* Node */}
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-30% 0px' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-accent bg-ink-950 md:left-[30%]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </motion.span>

                <Reveal className="md:pr-12 md:text-right">
                  <p className="font-mono text-xs uppercase tracking-widest text-accent">{job.period}</p>
                  <p className="mt-3 font-display text-2xl font-medium text-white">{job.company}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={13} /> {job.location}
                  </p>
                </Reveal>

                <Reveal delay={0.1} className="md:pl-12">
                  <div className="glass p-6 sm:p-8">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <h3 className="font-display text-xl font-medium text-white sm:text-2xl">{job.role}</h3>
                      <span className="chip shrink-0">{i === 0 ? 'Current' : 'Past'}</span>
                    </div>
                    <ul className="space-y-3">
                      {job.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-sm leading-relaxed text-slate-400 sm:text-[15px]">
                          <ArrowUpRight size={15} className="mt-1 shrink-0 text-accent" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
