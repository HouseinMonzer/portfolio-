import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Code2, Database, Globe, Network, Palette, Wrench } from 'lucide-react'
import { skillCategories, type SkillIcon } from '../data/portfolio'
import { EASE } from '../lib/scroll'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'
import TechSphere from './TechSphere'

const icons: Record<SkillIcon, typeof Globe> = { globe: Globe, database: Database, code: Code2, palette: Palette, network: Network, wrench: Wrench }

const sphereTags = Array.from(new Set(skillCategories.flatMap((c) => c.skills))).slice(0, 34)

export default function Skills() {
  const [active, setActive] = useState(0)
  const cat = skillCategories[active]

  return (
    <section id="skills" className="section overflow-hidden">
      <div className="container-x">
        <SectionHeading index="02" eyebrow="Expertise" title="A toolkit for" accent="the whole stack.">
          From interface to infrastructure. Hover the sphere to steer it, or pick a discipline to dig in.
        </SectionHeading>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <div role="tablist" aria-label="Skill categories" className="flex flex-col">
              {skillCategories.map((c, i) => {
                const Icon = icons[c.icon]
                const isActive = i === active
                return (
                  <button
                    key={c.title}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="skill-panel"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className="group relative border-b border-white/5 py-5 text-left"
                  >
                    {isActive && <motion.span layoutId="skill-line" className="absolute bottom-[-1px] left-0 h-px w-full bg-gradient-to-r from-accent to-violet-500" />}
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-slate-600">0{i + 1}</span>
                      <Icon size={18} className={`transition-colors ${isActive ? 'text-accent' : 'text-slate-600 group-hover:text-slate-400'}`} />
                      <span className={`font-display text-xl transition-colors sm:text-2xl ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{c.title}</span>
                      <span className="ml-auto font-mono text-xs text-slate-600">{c.skills.length}</span>
                    </div>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          id="skill-panel"
                          role="tabpanel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-2 pl-[4.25rem] pt-4">
                            {cat.skills.map((s, j) => (
                              <motion.span
                                key={s}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 + j * 0.035 }}
                                className="rounded-full border border-accent/20 bg-accent/[0.06] px-3 py-1 font-mono text-xs text-accent-soft"
                              >
                                {s}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                )
              })}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="order-1 lg:order-2">
            <TechSphere tags={sphereTags} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
