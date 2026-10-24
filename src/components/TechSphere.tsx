import { useEffect, useMemo, useRef } from 'react'

/**
 * A rotating 3D sphere of tags built with CSS transforms (no WebGL needed).
 * Drag/hover steers rotation; tags facing away fade and shrink.
 */
export default function TechSphere({ tags }: { tags: string[] }) {
  const container = useRef<HTMLDivElement>(null)
  const nodes = useRef<(HTMLSpanElement | null)[]>([])

  // Evenly distribute points on a sphere (Fibonacci lattice).
  const points = useMemo(
    () =>
      tags.map((_, i) => {
        const phi = Math.acos(-1 + (2 * i + 1) / tags.length)
        const theta = Math.sqrt(tags.length * Math.PI) * phi
        return [Math.cos(theta) * Math.sin(phi), Math.sin(theta) * Math.sin(phi), Math.cos(phi)] as [number, number, number]
      }),
    [tags],
  )

  useEffect(() => {
    const el = container.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let vx = 0.0025
    let vy = 0.004
    let targetVx = vx
    let targetVy = vy
    let ax = 0
    let ay = 0
    let raf = 0
    let visible = true

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      targetVy = ((e.clientX - (r.left + r.width / 2)) / r.width) * 0.03
      targetVx = (-(e.clientY - (r.top + r.height / 2)) / r.height) * 0.03
    }
    const onLeave = () => {
      targetVx = 0.0025
      targetVy = 0.004
    }

    const render = () => {
      vx += (targetVx - vx) * 0.05
      vy += (targetVy - vy) * 0.05
      ax += vx
      ay += vy
      const [sx, cx, sy, cy] = [Math.sin(ax), Math.cos(ax), Math.sin(ay), Math.cos(ay)]
      const radius = el.clientWidth * 0.38 // responsive to the container
      points.forEach(([x, y, z], i) => {
        // rotate around X then Y
        const y1 = y * cx - z * sx
        const z1 = y * sx + z * cx
        const x2 = x * cy + z1 * sy
        const z2 = -x * sy + z1 * cy
        const node = nodes.current[i]
        if (!node) return
        const depth = (z2 + 1) / 2 // 0 back → 1 front
        node.style.transform = `translate(-50%, -50%) translate3d(${x2 * radius}px, ${y1 * radius}px, 0) scale(${0.6 + depth * 0.6})`
        node.style.opacity = String(0.15 + depth * 0.85)
        node.style.zIndex = String(Math.round(depth * 100))
        node.style.filter = depth < 0.35 ? 'blur(1px)' : 'none'
      })
      if (visible && !reduce) raf = requestAnimationFrame(render)
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(render)
    })
    io.observe(el)
    render()
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [points])

  return (
    <div ref={container} className="relative mx-auto aspect-square w-full max-w-[460px] select-none" aria-label="Technologies I use" role="img">
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.14),transparent_65%)]" />
      <div className="absolute inset-[8%] rounded-full border border-white/5" />
      <div className="absolute inset-[22%] rounded-full border border-dashed border-white/5 animate-spin-slow" />
      <div className="absolute left-1/2 top-1/2">
        {tags.map((t, i) => (
          <span
            key={t}
            ref={(n) => (nodes.current[i] = n)}
            className="absolute left-0 top-0 whitespace-nowrap rounded-full border border-white/10 bg-ink-800/80 px-3 py-1 font-mono text-xs text-slate-200 backdrop-blur-sm will-change-transform"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
