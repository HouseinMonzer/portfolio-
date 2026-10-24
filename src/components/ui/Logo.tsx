import { useId } from 'react'

/**
 * Circuit Monogram — "HM" drawn as PCB traces ending in nodes.
 * A small-size cut of brand/social/svg/05-circuit-monogram.svg with heavier strokes.
 * Node holes use `--logo-bg` so they match whatever surface the logo sits on.
 */
export function Logo({ className = 'h-8 w-8', title }: { className?: string; title?: string }) {
  // React 18 ids contain colons, which break url(#…) references.
  const id = `hm-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={id} x1="4" y1="6" x2="60" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path
        d="M8 10v44M22.5 10v44M8 32h14.5M37 54V10l9.5 9.5L56 10v44"
        stroke={`url(#${id})`}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="var(--logo-bg, #04060b)" stroke={`url(#${id})`} strokeWidth="2.6">
        <circle cx="8" cy="10" r="3.8" />
        <circle cx="8" cy="54" r="3.8" />
        <circle cx="22.5" cy="10" r="3.8" />
        <circle cx="22.5" cy="54" r="3.8" />
        <circle cx="37" cy="54" r="3.8" />
        <circle cx="56" cy="54" r="3.8" />
      </g>
      <g fill="#e2e8f0">
        <circle cx="8" cy="32" r="2.4" />
        <circle cx="22.5" cy="32" r="2.4" />
        <circle cx="46.5" cy="19.5" r="2.4" />
      </g>
    </svg>
  )
}
