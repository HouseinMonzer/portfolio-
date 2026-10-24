import { ArrowUpRight, Code2, Gauge, Layers, MapPin, Sparkles } from 'lucide-react'
import { personal, projects, stats } from '../data/portfolio'
import { useLocalTime } from '../hooks/useLocalTime'
import { Counter } from './ui/Counter'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'
import { TiltCard } from './ui/TiltCard'

const principles = [
  { icon: Layers, title: 'Full-stack ownership', desc: 'Requirements → UI/UX → API → database → deploy. One person, no hand-off gaps.' },
  { icon: Gauge, title: 'Performance first', desc: 'Lean bundles, optimized media and SEO-ready markup that load fast on real networks.' },
  { icon: Code2, title: 'Typed & maintainable', desc: 'TypeScript end-to-end, validated inputs and clean components that are easy to extend.' },
]

export default function About() {
  const time = useLocalTime('Asia/Beirut')
  const souqna = projects.find((p) => p.name === 'SouQna')

  return (
    <section id="about" className="section">
      <div className="container-x">
        <SectionHeading index="01" eyebrow="About" title="Engineer by training," accent="builder by obsession.">
          {personal.summary}
        </SectionHeading>

        <div className="grid auto-rows-[minmax(0,auto)] gap-4 lg:grid-cols-12">
          {/* Portrait */}
          <Reveal className="lg:col-span-5 lg:row-span-2">
            <TiltCard max={6} className="flex h-full min-h-[440px] flex-col overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.18),transparent_60%)]" />
              <div className="absolute inset-x-10 bottom-16 top-10 rounded-full border border-white/5" style={{ transform: 'translateZ(20px)' }} />
              <img
                src="/avatar.png"
                alt="3D illustration of Housein Monzer coding at his desk"
                width={399}
                height={600}
                loading="lazy"
                className="relative mx-auto mt-auto h-[400px] w-auto object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]"
                style={{ transform: 'translateZ(60px)' }}
              />
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-emerald-400/30 bg-ink-900/80 px-3 py-1.5 text-xs text-emerald-300 backdrop-blur" style={{ transform: 'translateZ(80px)' }}>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Open to work
              </div>
              <div className="absolute bottom-5 right-5 rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3 text-right backdrop-blur" style={{ transform: 'translateZ(90px)' }}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Degree</p>
                <p className="font-display text-sm text-white">BSc Computer Science</p>
              </div>
            </TiltCard>
          </Reveal>

          {/* Stats */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="glass grid h-full grid-cols-2 divide-white/5 sm:grid-cols-4 sm:divide-x">
              {stats.map((s) => (
                <div key={s.label} className="p-6 sm:p-7">
                  <p className="font-display text-4xl font-semibold text-white sm:text-5xl">
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 text-xs leading-snug text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Currently building */}
          {souqna && (
            <Reveal delay={0.15} className="lg:col-span-4">
              <a href={souqna.live ?? '#projects'} target="_blank" rel="noopener noreferrer" className="glass spotlight group flex h-full flex-col justify-between gap-6 overflow-hidden p-6" data-cursor="Visit"
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
                  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow !tracking-[0.2em]"><Sparkles size={12} /> Currently building</span>
                  <ArrowUpRight size={18} className="text-slate-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <div>
                  <p className="font-display text-3xl font-semibold text-white">{souqna.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{souqna.tagline}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {souqna.tags.slice(0, 4).map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
              </a>
            </Reveal>
          )}

          {/* Local time */}
          <Reveal delay={0.2} className="lg:col-span-3">
            <div className="glass flex h-full flex-col justify-between gap-6 overflow-hidden p-6">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-accent" /> Beirut, LB</span>
                <span className="font-mono">GMT+3</span>
              </div>
              <div className="relative">
                <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full border border-dashed border-accent/20 animate-spin-slow" />
                <p className="font-display text-5xl font-semibold tabular-nums text-white">{time}</p>
                <p className="mt-1 text-xs text-slate-500">Working remotely worldwide</p>
              </div>
            </div>
          </Reveal>

          {/* Principles */}
          <Reveal delay={0.1} className="lg:col-span-12">
            <div className="grid gap-4 md:grid-cols-3">
              {principles.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="glass group p-6 transition-colors duration-500 hover:border-accent/20">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-lg font-medium text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
