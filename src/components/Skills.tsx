import type { RefObject } from 'react'
import { skillCategories } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

export default function Skills() {
  const { ref, inView } = useInView()

  return (
    <section id="skills" className="section-padding">
      <div
        ref={ref as RefObject<HTMLDivElement>}
        className={`max-container transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
          Technical <span className="gradient-text">Skills</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-10" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map(({ title, icon, skills }, catIdx) => (
            <div
              key={title}
              className="card-glow rounded-xl p-6"
              style={{ transitionDelay: `${catIdx * 80}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-semibold text-white text-sm">{title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-navy-900/80 border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-400 text-slate-300 text-xs font-mono px-3 py-1.5 rounded-full transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
