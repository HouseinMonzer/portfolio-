import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { VisualMedia } from '../../data/visuals'
import { lockScroll } from '../../lib/scroll'

type Props = {
  title: string
  items: VisualMedia[]
  index: number | null
  onIndex: (i: number) => void
  onClose: () => void
}

/**
 * Full-screen viewer for portfolio media. Shows each file at its own aspect ratio (no cropping),
 * ← / → to step, Esc to close, focus kept inside while open and returned to the opener after.
 * Videos get native controls and never autoplay.
 */
export function Lightbox({ title, items, index, onIndex, onClose }: Props) {
  const dialog = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const open = index !== null
  const item = open ? items[index] : null

  useEffect(() => {
    if (!open) return
    opener.current = document.activeElement as HTMLElement | null
    lockScroll(true)
    const t = setTimeout(() => dialog.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 30)
    return () => {
      clearTimeout(t)
      lockScroll(false)
      opener.current?.focus({ preventScroll: true })
    }
  }, [open])

  const step = (d: number) => index !== null && items.length > 1 && onIndex((index + d + items.length) % items.length)

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowRight') step(1)
    else if (e.key === 'ArrowLeft') step(-1)
    else if (e.key === 'Tab') {
      // Keep Tab cycling through the dialog's own controls.
      const els = [...(dialog.current?.querySelectorAll<HTMLElement>('button, video, [tabindex="0"]') ?? [])]
      if (els.length === 0) return
      const i = els.indexOf(document.activeElement as HTMLElement)
      const next = e.shiftKey ? (i <= 0 ? els.length - 1 : i - 1) : i === els.length - 1 ? 0 : i + 1
      e.preventDefault()
      els[next].focus()
    }
  }

  return (
    <AnimatePresence>
      {item && index !== null && (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={`${title}, ${index + 1} of ${items.length}`}
          onKeyDown={onKeyDown}
          className="fixed inset-0 z-[85] flex flex-col bg-ink-950/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-lenis-prevent
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="min-w-0 truncate text-sm text-slate-300">
              <span className="text-white">{title}</span>
              {items.length > 1 && <span className="ml-3 font-mono text-xs text-slate-400">{index + 1} / {items.length}</span>}
            </p>
            <button onClick={onClose} data-autofocus aria-label="Close viewer" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-accent hover:text-accent">
              <X size={18} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-20">
            <motion.figure
              key={item.src}
              className="flex max-h-full max-w-full flex-col items-center"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              {item.kind === 'video' ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  width={item.width}
                  height={item.height}
                  controls
                  playsInline
                  preload="metadata"
                  className="max-h-[calc(100svh-9rem)] w-auto max-w-full rounded-xl bg-black"
                  aria-label={item.alt}
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="max-h-[calc(100svh-9rem)] w-auto max-w-full rounded-xl object-contain"
                />
              )}
              <figcaption className="mt-3 max-w-2xl text-center text-xs leading-relaxed text-slate-400">{item.alt}</figcaption>
            </motion.figure>

            {items.length > 1 && (
              <>
                <button onClick={() => step(-1)} aria-label="Previous image" className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink-900/80 text-white transition-colors hover:border-accent hover:text-accent sm:left-5">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => step(1)} aria-label="Next image" className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink-900/80 text-white transition-colors hover:border-accent hover:text-accent sm:right-5">
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
