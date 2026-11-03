import Lenis from 'lenis'

let lenis: Lenis | null = null

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Starts Lenis smooth scrolling (skipped for reduced-motion users). Returns a cleanup fn.
 *  Also skipped on touch screens: Lenis leaves touch scrolling native there, so its frame loop would only burn battery. */
export function initSmoothScroll(): () => void {
  if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return () => {}
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), wheelMultiplier: 0.95 })
  let raf = requestAnimationFrame(function loop(time) {
    lenis?.raf(time)
    raf = requestAnimationFrame(loop)
  })
  return () => {
    cancelAnimationFrame(raf)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToId(id: string) {
  const el = id === 'top' ? document.body : document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(id === 'top' ? 0 : el, { offset: -72, duration: 1.4 })
  else {
    // Same 72px allowance for the fixed navbar as the Lenis path.
    const top = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 72
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
  history.replaceState(null, '', id === 'top' ? location.pathname : `#${id}`)
}

export function lockScroll(locked: boolean) {
  if (lenis) (locked ? lenis.stop() : lenis.start())
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

export const EASE = [0.22, 1, 0.36, 1] as const
