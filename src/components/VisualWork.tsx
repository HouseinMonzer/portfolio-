import { useMemo, useState } from 'react'
import { ArrowRight, ArrowUpRight, Expand, Images, Play } from 'lucide-react'
import { categoryLabels, publishedVisuals, type VisualCategory, type VisualProject } from '../data/visuals'
import { discussProject } from '../lib/contactIntent'
import { Lightbox } from './ui/Lightbox'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

type Filter = 'all' | VisualCategory

function mediaCount(p: VisualProject) {
  const videos = p.media.filter((m) => m.kind === 'video').length
  const images = p.media.length - videos
  return [images && `${images} image${images > 1 ? 's' : ''}`, videos && `${videos} video${videos > 1 ? 's' : ''}`].filter(Boolean).join(' · ')
}

function ProjectCard({ p, onOpen }: { p: VisualProject; onOpen: () => void }) {
  const cover = p.media[0]
  const src = cover.kind === 'video' ? cover.poster : cover.src
  return (
    <article className="glass group flex h-full flex-col overflow-hidden p-2">
      <button
        onClick={onOpen}
        aria-label={`View ${p.title}: ${mediaCount(p)}`}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-[1.25rem] bg-ink-800"
        data-cursor="View"
      >
        <img
          src={src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-ink-950/70 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden>
          {cover.kind === 'video' ? <Play size={15} /> : <Expand size={15} />}
        </span>
      </button>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-accent-soft">{p.deliverable}</span>
          <span className="text-slate-400">{categoryLabels[p.category]}</span>
        </div>
        <h3 className="mt-3 font-display text-xl font-medium text-white">{p.title}</h3>
        {p.client && (
          <p className="mt-1 text-sm text-slate-400">
            For{' '}
            {p.client.url ? (
              <a href={p.client.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-slate-200 underline decoration-white/20 underline-offset-4 hover:text-accent hover:decoration-accent">
                {p.client.name} <ArrowUpRight size={13} aria-hidden />
              </a>
            ) : (
              <span className="text-slate-200">{p.client.name}</span>
            )}
          </p>
        )}
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.description}</p>
        <p className="mt-auto inline-flex items-center gap-1.5 pt-3 font-mono text-xs text-slate-400">
          <Images size={13} aria-hidden /> {mediaCount(p)}
        </p>
      </div>
    </article>
  )
}

export default function VisualWork() {
  const [filter, setFilter] = useState<Filter>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const [mediaIndex, setMediaIndex] = useState(0)

  // Only offer filters that have published work behind them.
  const filters = useMemo<Filter[]>(() => {
    const present = new Set(publishedVisuals.map((p) => p.category))
    const cats = (Object.keys(categoryLabels) as VisualCategory[]).filter((c) => present.has(c))
    return cats.length > 1 ? ['all', ...cats] : []
  }, [])

  const shown = filter === 'all' ? publishedVisuals : publishedVisuals.filter((p) => p.category === filter)
  const openProject = publishedVisuals.find((p) => p.id === openId)

  if (publishedVisuals.length === 0) return null

  return (
    <section id="visuals" className="section">
      <div className="container-x">
        <SectionHeading index="06" eyebrow="Visual work" title="AI visuals," accent="art-directed.">
          Brand identity, campaigns and imagery created with AI tools and careful art direction. Open a project to see
          every file at full size.
        </SectionHeading>

        {filters.length > 0 && (
          <Reveal y={12}>
            <div role="group" aria-label="Filter visual work" className="mb-10 flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`min-h-11 rounded-full border px-4 py-2 text-sm transition-colors ${
                    filter === f ? 'border-white bg-white text-ink-950' : 'border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {f === 'all' ? 'All' : categoryLabels[f]}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {/* Row-by-row grid; covers share one 4:5 frame (object-contain, never cropped) so rows line up. */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <ProjectCard
              key={p.id}
              p={p}
              onOpen={() => {
                setMediaIndex(0)
                setOpenId(p.id)
              }}
            />
          ))}
        </div>

        <Reveal y={16}>
          <div className="glass mt-12 flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="font-display text-xl text-white">Have a product to shoot or a campaign to launch?</p>
              <p className="mt-1 text-sm text-slate-400">Send the product photos and what you need. I’ll reply with ideas, formats and a timeline.</p>
            </div>
            <button onClick={() => discussProject()} className="btn-primary group shrink-0">
              Discuss your project <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </Reveal>
      </div>

      <Lightbox
        title={openProject?.title ?? ''}
        items={openProject?.media ?? []}
        index={openProject ? mediaIndex : null}
        onIndex={setMediaIndex}
        onClose={() => setOpenId(null)}
      />
    </section>
  )
}
