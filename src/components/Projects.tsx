import type { RefObject } from 'react'
import { ExternalLink, Github, Sparkles } from 'lucide-react'
import { projects } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

export default function Projects() {
  const { ref, inView } = useInView()
  const featured = projects.find((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="section-padding">
      <div
        ref={ref as RefObject<HTMLDivElement>}
        className={`max-container transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
          Featured <span className="gradient-text">Projects</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-10" />

        {featured && (
          <article className="card-glow rounded-2xl overflow-hidden mb-10 grid lg:grid-cols-2">
            <div className="relative aspect-[16/10] lg:aspect-auto bg-navy-900 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-700/50">
              <img
                src={featured.image}
                alt={`${featured.name} preview`}
                loading="lazy"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
              {featured.status && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-navy-900/90 border border-cyan-500/40 text-cyan-400 text-xs font-mono px-3 py-1 rounded-full backdrop-blur-sm">
                  <Sparkles size={12} /> {featured.status}
                </span>
              )}
            </div>

            <div className="p-6 lg:p-8 flex flex-col gap-4">
              <div>
                <p className="text-cyan-400 text-xs font-mono mb-2 tracking-widest uppercase">
                  Featured Project
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{featured.name}</h3>
                {featured.tagline && (
                  <p className="text-slate-400 text-sm">{featured.tagline}</p>
                )}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{featured.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {featured.tags.map((t) => (
                  <span
                    key={t}
                    className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono px-2.5 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {featured.live && (
                  <a
                    href={featured.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
                {featured.code && (
                  <a
                    href={featured.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                  >
                    <Github size={14} /> Source Code
                  </a>
                )}
              </div>
            </div>
          </article>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((project, idx) => (
            <article
              key={project.name}
              className="card-glow rounded-xl p-5 flex flex-col gap-3 group"
              style={{ transitionDelay: `${idx * 60}ms` }}
            >
              <div>
                <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  {project.name}
                </h4>
                {project.tagline && (
                  <p className="text-slate-500 text-xs mt-0.5">{project.tagline}</p>
                )}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">{project.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {(project.live || project.code) && (
                <div className="flex gap-3 border-t border-slate-700/50 mt-1 pt-3">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs font-medium transition-colors"
                    >
                      <ExternalLink size={12} /> Live
                    </a>
                  )}
                  {project.code && (
                    <a
                      href={project.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-400 text-xs font-medium transition-colors"
                    >
                      <Github size={12} /> Code
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
