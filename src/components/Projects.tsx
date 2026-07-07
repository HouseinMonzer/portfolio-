import type { RefObject } from 'react'
import { ExternalLink, Github, Sparkles } from 'lucide-react'
import { projects, wordpressSites } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

export default function Projects() {
  const { ref, inView } = useInView()
  const featured = projects.filter((p) => p.featured)
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

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {featured.map((p) => (
            <article key={p.name} className="card-glow rounded-2xl overflow-hidden flex flex-col group">
              <div className="relative aspect-[20/10] bg-navy-900 overflow-hidden border-b border-slate-700/50">
                {p.image && (
                  <img
                    src={p.image}
                    alt={`${p.name} preview`}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                  />
                )}
                {p.status && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-navy-900/90 border border-cyan-500/40 text-cyan-400 text-xs font-mono px-3 py-1 rounded-full backdrop-blur-sm">
                    <Sparkles size={12} /> {p.status}
                  </span>
                )}
              </div>

              <div className="p-5 lg:p-6 flex flex-col gap-3 flex-1">
                <div>
                  <p className="text-cyan-400 text-xs font-mono mb-1.5 tracking-widest uppercase">
                    Featured Project
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{p.name}</h3>
                  {p.tagline && <p className="text-slate-400 text-sm">{p.tagline}</p>}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono px-2.5 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
                    >
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                  {p.code && (
                    <a
                      href={p.code}
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
          ))}
        </div>

        {/* ── WordPress client sites (Synctale) — horizontal scroll gallery ── */}
        <div className="mt-4 mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-1.5">
            <h3 className="text-xl sm:text-2xl font-bold text-white">WordPress Client Sites</h3>
            <span className="text-xs font-mono text-cyan-400 border border-cyan-500/30 rounded-full px-2.5 py-0.5">
              Synctale · 2 yrs
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-2xl">
            Live WordPress sites I designed, built, and maintained for Synctale clients — theme
            customization, plugin integration, on-page SEO, and load-time optimization.
          </p>

          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
            {wordpressSites.map((site) => (
              <a
                key={site.url}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group shrink-0 w-60 sm:w-64 snap-start card-glow rounded-xl overflow-hidden"
              >
                <div className="aspect-[19/10] bg-navy-900 overflow-hidden">
                  <img
                    src={site.image}
                    alt={`${site.name} website`}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate group-hover:text-cyan-400 transition-colors">
                      {site.name}
                    </p>
                    <p className="text-slate-500 text-xs truncate">{site.tag}</p>
                  </div>
                  <ExternalLink size={14} className="text-slate-500 group-hover:text-cyan-400 shrink-0 transition-colors" />
                </div>
              </a>
            ))}

            {/* & more */}
            <div className="shrink-0 w-52 snap-start rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-center p-6">
              <Sparkles size={20} className="mb-2 text-cyan-400/70" />
              <p className="text-sm font-semibold text-slate-200">& more</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Additional client sites over 2 years at Synctale
              </p>
            
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
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
