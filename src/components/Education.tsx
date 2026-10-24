import { motion } from 'framer-motion'
import { Award, GraduationCap, Languages } from 'lucide-react'
import { certifications, education, languages } from '../data/portfolio'
import { EASE } from '../lib/scroll'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'
import { TiltCard } from './ui/TiltCard'

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="container-x">
        <SectionHeading index="05" eyebrow="Education" title="Always" accent="learning." />

        <div className="grid gap-4 lg:grid-cols-12">
          {/* Degree */}
          {education.map((edu) => (
            <Reveal key={edu.degree} className="lg:col-span-7">
              <TiltCard max={4} className="flex h-full flex-col justify-between gap-10 overflow-hidden p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
                    <GraduationCap size={22} />
                  </span>
                  <span className="chip">{edu.period}</span>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-medium leading-snug text-white sm:text-3xl">{edu.degree}</h3>
                  <p className="mt-3 text-slate-400">{edu.institution}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}

          {/* Languages */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="glass h-full p-8">
              <p className="mb-8 flex items-center gap-2 font-display text-lg text-white">
                <Languages size={18} className="text-accent" /> Languages
              </p>
              <div className="space-y-6">
                {languages.map((l, i) => (
                  <div key={l.name}>
                    <div className="mb-2 flex items-baseline justify-between text-sm">
                      <span className="text-white">{l.name}</span>
                      <span className="font-mono text-xs text-slate-500">{l.level}</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-violet-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${l.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, delay: 0.2 + i * 0.15, ease: EASE }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Certifications */}
          <div className="lg:col-span-12">
            <Reveal>
              <p className="mb-5 mt-8 flex items-center gap-2 font-display text-lg text-white">
                <Award size={18} className="text-accent" /> Certifications
              </p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {certifications.map((c, i) => (
                <Reveal key={c.name} delay={i * 0.06}>
                  <div className="glass group flex h-full flex-col justify-between gap-6 p-5 transition-colors duration-500 hover:border-white/15">
                    <div className={`h-1 w-10 rounded-full bg-gradient-to-r ${c.color} transition-all duration-500 group-hover:w-16`} />
                    <div>
                      <p className="text-sm font-medium leading-snug text-white">{c.name}</p>
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">{c.issuer}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
