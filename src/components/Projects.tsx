import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowUpRight, Github, Sparkles } from 'lucide-react'
import { projects, wordpressSites, type Project } from '../data/portfolio'
import { EASE } from '../lib/scroll'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'
import { TiltCard } from './ui/TiltCard'

function FeaturedProject({ p, index }: { p: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])
  const reversed = index % 2 === 1

  return (
    <div ref={ref} className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <Reveal className={`lg:col-span-7 ${reversed ? 'lg:order-2' : ''}`}>
        <TiltCard as="article" max={5} className="group overflow-hidden p-2">
          <a href={p.live ?? undefined} target="_blank" rel="noopener noreferrer" data-cursor="Open" className="block" aria-label={`Open ${p.name} live site`}>
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-3 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="ml-3 truncate rounded-md bg-white/[0.04] px-3 py-1 font-mono text-[10px] text-slate-500">
                {p.live?.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </span>
            </div>
            <div className="relative aspect-[2/1] overflow-hidden rounded-[1.25rem] bg-ink-800">
              {p.image && (
                <motion.img
                  src={p.image}
                  alt={`${p.name} — screenshot`}
                  loading="lazy"
                  style={{ y: imgY, scale: 1.08 }}
                  className="h-full w-full object-cover object-top transition-[filter] duration-700 group-hover:brightness-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
              {p.status && (
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-ink-950/80 px-3 py-1 font-mono text-[11px] text-accent backdrop-blur">
                  <Sparkles size={11} /> {p.status}
                </span>
              )}
            </div>
          </a>
        </TiltCard>
      </Reveal>

      <Reveal delay={0.15} className={`lg:col-span-5 ${reversed ? 'lg:order-1' : ''}`}>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
          <span className="text-accent">0{index + 1}</span> / Featured
        </p>
        <h3 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">{p.name}</h3>
        {p.tagline && <p className="mt-2 text-lg text-accent-soft">{p.tagline}</p>}
        <p className="mt-5 leading-relaxed text-slate-400">{p.description}</p>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {p.live && (
            <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn-primary group">
              Visit live site <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
          {p.code && (
            <a href={p.code} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <Github size={15} /> Source
            </a>
          )}
        </div>
      </Reveal>
    </div>
  )
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)
  const rail = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  return (
    <section id="projects" className="section">
      <div className="container-x">
        <SectionHeading index="05" eyebrow="Web work" title="Products I've" accent="designed & shipped.">
          A mix of full-stack products and client websites: each one live, in production, used by real people.
        </SectionHeading>

        <div className="space-y-28 sm:space-y-36">
          {featured.map((p, i) => <FeaturedProject key={p.name} p={p} index={i} />)}
        </div>

        {rest.length > 0 && (
          <div className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <TiltCard key={p.name} as="article" className="flex flex-col gap-3 p-6">
                <h4 className="font-display text-lg text-white">{p.name}</h4>
                <p className="flex-1 text-sm text-slate-400">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">{p.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>

      {/* WordPress client work — draggable rail */}
      <div className="mt-32">
        <div className="container-x mb-10 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="eyebrow mb-4">Client websites · Synctale</p>
            <h3 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              WordPress builds, <span className="text-slate-500">live in production.</span>
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Designed, built and maintained over two years: theme customization, plugin integration, on-page SEO and
              load-time optimization.
            </p>
          </Reveal>
          <p className="hidden font-mono text-xs text-slate-500 md:block">← drag to explore →</p>
        </div>

        <div ref={rail} className="overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={rail}
            dragElastic={0.08}
            onDragStart={() => (dragging.current = true)}
            onDragEnd={() => setTimeout(() => (dragging.current = false), 0)}
            className="flex w-max cursor-grab gap-5 px-4 active:cursor-grabbing sm:px-6 lg:px-10"
            data-cursor="Drag"
          >
            {wordpressSites.map((site, i) => (
              <motion.a
                key={site.url}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                draggable={false}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
                onClickCapture={(e) => dragging.current && e.preventDefault() /* a drag isn't a click */}
                className="group glass w-[280px] shrink-0 overflow-hidden p-2 sm:w-[360px]"
              >
                <div className="aspect-[2/1] overflow-hidden rounded-[1.25rem] bg-ink-800">
                  <img src={site.image} alt={`${site.name} website`} loading="lazy" draggable={false} className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]" />
                </div>
                <div className="flex items-center justify-between gap-3 px-3 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-display text-base text-white">{site.name}</p>
                    <p className="text-xs text-slate-500">{site.tag}</p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all duration-300 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-ink-950">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </motion.a>
            ))}
            <div className="glass flex w-[240px] shrink-0 flex-col items-center justify-center gap-2 border-dashed p-8 text-center">
              <Sparkles size={20} className="text-accent" />
              <p className="font-display text-white">& more</p>
              <p className="text-xs leading-relaxed text-slate-500">Additional client sites delivered at Synctale</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
