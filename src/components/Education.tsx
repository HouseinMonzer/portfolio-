import type { RefObject } from 'react'
import { GraduationCap, Award } from 'lucide-react'
import { education, certifications, languages } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

export default function Education() {
  const { ref, inView } = useInView()

  return (
    <section id="education" className="section-padding bg-navy-900/40">
      <div
        ref={ref as RefObject<HTMLDivElement>}
        className={`max-container transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
          Education & <span className="gradient-text">Certifications</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-10" />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Education */}
          <div className="lg:col-span-1">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-5">
              <GraduationCap size={20} className="text-cyan-400" /> Education
            </h3>
            {education.map((edu) => (
              <div key={edu.degree} className="card-glow rounded-xl p-5">
                <span className="text-3xl mb-3 block">{edu.icon}</span>
                <h4 className="font-semibold text-white mb-2 leading-snug">{edu.degree}</h4>
                <p className="text-cyan-400 text-sm mb-1">{edu.institution}</p>
                <p className="text-slate-500 text-sm">{edu.period}</p>
              </div>
            ))}

            {/* Languages */}
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mt-8 mb-5">
              🌍 Languages
            </h3>
            <div className="card-glow rounded-xl p-5 space-y-4">
              {languages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-200 font-medium">{lang.name}</span>
                    <span className="text-slate-400">{lang.level}</span>
                  </div>
                  <div className="h-1.5 bg-navy-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: inView ? `${lang.percent}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="lg:col-span-2">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-5">
              <Award size={20} className="text-cyan-400" /> Certifications
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {certifications.map((cert, idx) => (
                <div
                  key={cert.name}
                  className="card-glow rounded-xl p-5 flex flex-col gap-2"
                  style={{ transitionDelay: `${idx * 60}ms` }}
                >
                  <div
                    className={`w-8 h-1 bg-gradient-to-r ${cert.color} rounded-full mb-1`}
                  />
                  <h4 className="text-slate-100 font-medium text-sm leading-snug">{cert.name}</h4>
                  <p className="text-slate-500 text-xs">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
