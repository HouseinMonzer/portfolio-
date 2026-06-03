import type { RefObject } from 'react'
import { Briefcase, MapPin, Calendar, CheckCircle2 } from 'lucide-react'
import { experience } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

export default function Experience() {
  const { ref, inView } = useInView()

  return (
    <section id="experience" className="section-padding bg-navy-900/40">
      <div
        ref={ref as RefObject<HTMLDivElement>}
        className={`max-container transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
          Professional <span className="gradient-text">Experience</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-10" />

        <div className="relative pl-6 border-l-2 border-slate-700/60">
          {experience.map((job) => (
            <div key={job.role} className="relative mb-8 last:mb-0">
              {/* Timeline dot */}
              <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-cyan-500 border-2 border-navy-950 shadow-lg shadow-cyan-500/30" />

              <div className="card-glow rounded-xl p-6 ml-2">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{job.role}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Briefcase size={14} className="text-cyan-400" />
                      <span className="text-cyan-400 font-semibold">{job.company}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {job.period}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} />
                      {job.location}
                    </span>
                  </div>
                </div>

                {/* Bullets */}
                <ul className="space-y-2">
                  {job.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                      <CheckCircle2 size={15} className="text-cyan-500 mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
