import { ArrowRight, ArrowUpRight, Camera, Clapperboard, Code2, Globe, Megaphone, Palette, Printer, ShoppingBag } from 'lucide-react'
import { visualServices, webServices, type Service, type ServiceIcon } from '../data/services'
import { discussProject } from '../lib/contactIntent'
import { scrollToId } from '../lib/scroll'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

const icons: Record<ServiceIcon, typeof Globe> = { code: Code2, globe: Globe, camera: Camera, bag: ShoppingBag, megaphone: Megaphone, clapper: Clapperboard, palette: Palette, printer: Printer }

function ServiceCard({ s }: { s: Service }) {
  const Icon = icons[s.icon]
  return (
    <article className="glass group flex h-full flex-col p-6 transition-colors duration-500 hover:border-accent/25">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
        <Icon size={20} />
      </div>
      <h4 className="font-display text-xl font-medium text-white">{s.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.summary}</p>
      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-400">
        {s.points.map((p) => (
          <li key={p} className="flex gap-2.5">
            <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
            {p}
          </li>
        ))}
      </ul>
      {s.formats && (
        <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Common formats">
          {s.formats.map((f) => <span key={f} className="chip">{f}</span>)}
        </div>
      )}
      <button
        onClick={() => discussProject(s.id)}
        className="mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-sm font-semibold text-accent transition-colors hover:text-white"
      >
        Discuss this <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </article>
  )
}

function Group({ label, intro, services, workId, workLabel }: { label: string; intro: string; services: Service[]; workId: string; workLabel: string }) {
  return (
    <div>
      <Reveal y={16}>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">{label}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">{intro}</p>
          </div>
          <button onClick={() => scrollToId(workId)} className="btn-ghost min-h-11 !px-4 !py-2 text-sm">
            {workLabel} <ArrowUpRight size={14} />
          </button>
        </div>
      </Reveal>
      <div className={`grid gap-4 sm:grid-cols-2 ${services.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
        {services.map((s, i) => (
          <Reveal key={s.id} delay={Math.min(i, 3) * 0.06} y={24} className="h-full">
            <ServiceCard s={s} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container-x">
        <SectionHeading index="02" eyebrow="Services" title="What you can" accent="hire me for.">
          Two crafts, one standard: websites that work hard for your business, and AI-made visuals that stay true to your
          product.
        </SectionHeading>

        <div className="space-y-20">
          <Group
            label="Web development"
            intro="Websites and web apps built end-to-end, from the first wireframe to a fast, secure production deploy."
            services={webServices}
            workId="projects"
            workLabel="See web work"
          />
          <Group
            label="AI visual content"
            intro="Product imagery, campaigns and video concepts, from creative direction to files ready for your store and social channels."
            services={visualServices}
            workId="visuals"
            workLabel="See visual work"
          />
        </div>
      </div>
    </section>
  )
}
