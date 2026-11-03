import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { currency, pricingNote, pricingNoteAr, visualPackages, webPackages, type Package } from '../data/pricing'
import { discussProject } from '../lib/contactIntent'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

type Lang = 'en' | 'ar'

// Most clients are in Lebanon, so the packages can be read in Arabic too.
const copy = {
  en: {
    from: 'from',
    recommended: 'Recommended',
    choose: 'Choose this',
    visualsTitle: 'AI visual content',
    visualsIntro: 'Per product or per design, with revisions included. Bundles and monthly work get better rates.',
    webTitle: 'Websites',
    webIntro: 'Fixed starting prices for common projects; larger builds are quoted after a short call.',
  },
  ar: {
    from: 'يبدأ من',
    recommended: 'الأنسب',
    choose: 'اختار هالباقة',
    visualsTitle: 'صور ومحتوى بالذكاء الاصطناعي',
    visualsIntro: 'للمنتج أو للتصميم، والتعديلات محسوبة. الطلبات الكبيرة والشغل الشهري إلن سعر أحسن.',
    webTitle: 'مواقع إلكترونية',
    webIntro: 'أسعار بتبدأ من للمشاريع المعروفة، والمشاريع الأكبر منسعّرها بعد مكالمة قصيرة.',
  },
}

const prefersArabic = () => typeof navigator !== 'undefined' && (navigator.languages ?? [navigator.language]).some((l) => l?.startsWith('ar'))

function PackageCard({ p, lang }: { p: Package; lang: Lang }) {
  const ar = lang === 'ar'
  const t = copy[lang]
  const price = `${currency}${p.price}`
  const name = (ar && p.nameAr) || p.name
  const unit = (ar && p.unitAr) || p.unit
  const includes = (ar && p.includesAr) || p.includes
  return (
    <article className={`glass relative flex h-full flex-col p-6 ${p.highlight ? '!border-accent/40 shadow-glow' : ''}`}>
      {p.highlight && (
        <span
          className={`absolute -top-3 start-6 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-ink-950 ${ar ? '' : 'font-mono uppercase tracking-wider'}`}
        >
          {t.recommended}
        </span>
      )}
      <h4 className="font-display text-lg font-medium text-white">{name}</h4>
      <p className="mt-4 flex items-baseline gap-2">
        <span className={`text-xs text-slate-400 ${ar ? '' : 'uppercase tracking-wider'}`}>{t.from}</span>
        <span dir="ltr" className="font-display text-4xl font-semibold tabular-nums text-white">{price}</span>
      </p>
      <p className="mt-1 text-sm text-slate-400">{unit}</p>
      <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-slate-300">
        {includes.map((item) => (
          <li key={item} className="flex gap-2.5">
            <Check size={15} className="mt-[0.2em] shrink-0 text-accent" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <button
          // The contact form is in English, so the prefilled subject always uses the English name.
          onClick={() => discussProject(p.service, `${p.name} (from ${price})`)}
          className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors ${
            p.highlight ? 'bg-accent text-ink-950 hover:bg-white' : 'border border-white/10 text-white hover:border-accent hover:text-accent'
          }`}
          aria-label={`${t.choose}: ${name}, ${t.from} ${price}`}
        >
          {t.choose} <ArrowRight size={15} className="rtl:-scale-x-100" aria-hidden />
        </button>
      </div>
    </article>
  )
}

function Group({ title, intro, packages, cols, lang }: { title: string; intro: string; packages: Package[]; cols: string; lang: Lang }) {
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
            <PackageCard p={p} lang={lang} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default function Pricing() {
  const [lang, setLang] = useState<Lang>(() => (prefersArabic() ? 'ar' : 'en'))
  const t = copy[lang]
  const ar = lang === 'ar'

  return (
    <section id="pricing" className="section">
      <div className="container-x">
        <SectionHeading index="07" eyebrow="Pricing" title="Clear packages," accent="starting prices.">
          Pick a package to start the conversation. {pricingNote}
        </SectionHeading>

        <div role="group" aria-label="Pricing language" className="-mt-6 mb-12 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-sm sm:-mt-10">
          {(['en', 'ar'] as const).map((l) => (
            <button
              key={l}
              lang={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`min-h-11 rounded-full px-5 transition-colors ${lang === l ? 'bg-white font-semibold text-ink-950' : 'text-slate-400 hover:text-white'}`}
            >
              {l === 'en' ? 'English' : 'عربي'}
            </button>
          ))}
        </div>

        <div dir={ar ? 'rtl' : 'ltr'} lang={lang} className="space-y-20">
          {ar && <p className="-mt-6 max-w-2xl text-base leading-relaxed text-slate-400">{pricingNoteAr}</p>}
          <Group title={t.visualsTitle} intro={t.visualsIntro} packages={visualPackages} cols="lg:grid-cols-4" lang={lang} />
          <Group title={t.webTitle} intro={t.webIntro} packages={webPackages} cols="lg:grid-cols-3" lang={lang} />
        </div>
      </div>
    </section>
  )
}
