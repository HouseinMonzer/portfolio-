import { ArrowRight, Check } from 'lucide-react'
import { currency, pricingNote, visualPackages, webPackages, type Package } from '../data/pricing'
import { discussProject } from '../lib/contactIntent'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

function PackageCard({ p }: { p: Package }) {
  const price = `${currency}${p.price}`
  return (
    <article className={`glass relative flex h-full flex-col p-6 ${p.highlight ? '!border-accent/40 shadow-glow' : ''}`}>
      {p.highlight && (
        <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-950">
          Recommended
        </span>
      )}
      <h4 className="font-display text-lg font-medium text-white">{p.name}</h4>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="text-xs uppercase tracking-wider text-slate-400">from</span>
        <span className="font-display text-4xl font-semibold tabular-nums text-white">{price}</span>
      </p>
      <p className="mt-1 text-sm text-slate-400">{p.unit}</p>
      <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-slate-300">
        {p.includes.map((item) => (
          <li key={item} className="flex gap-2.5">
            <Check size={15} className="mt-[0.2em] shrink-0 text-accent" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <button
          onClick={() => discussProject(p.service, `${p.name} (from ${price})`)}
          className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors ${
            p.highlight ? 'bg-accent text-ink-950 hover:bg-white' : 'border border-white/10 text-white hover:border-accent hover:text-accent'
          }`}
          aria-label={`Choose ${p.name}, from ${price}`}
        >
          Choose this <ArrowRight size={15} aria-hidden />
        </button>
      </div>
    </article>
  )
}

function Group({ title, intro, packages, cols }: { title: string; intro: string; packages: Package[]; cols: string }) {
  if (packages.length === 0) return null
  return (
    <div>
      <Reveal y={16}>
        <h3 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">{intro}</p>
      </Reveal>
      <div className={`mt-8 grid gap-5 pt-3 sm:grid-cols-2 ${cols}`}>
        {packages.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 3) * 0.06} y={24} className="h-full">
            <PackageCard p={p} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="container-x">
        <SectionHeading index="07" eyebrow="Pricing" title="Clear packages," accent="starting prices.">
          Pick a package to start the conversation. {pricingNote}
        </SectionHeading>

        <div className="space-y-20">
          <Group
            title="AI visual content"
            intro="Per product or per design, with revisions included. Bundles and monthly work get better rates."
            packages={visualPackages}
            cols="lg:grid-cols-4"
          />
          <Group
            title="Websites"
            intro="Fixed starting prices for common projects; larger builds are quoted after a short call."
            packages={webPackages}
            cols="lg:grid-cols-3"
          />
        </div>
      </div>
    </section>
  )
}
