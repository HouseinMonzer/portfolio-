import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

/**
 * A particle swarm that swirls in from a cloud and locks into a shape, holds, bursts apart and
 * drifts, then gathers into the next shape: the HM Circuit Monogram (see ui/Logo.tsx), a laptop,
 * a </> code icon, and round again. Shapes are drawn on the 64-unit logo grid.
 */
type Pt = [number, number]
type Shape = {
  lines: [Pt, Pt][]
  rings?: { c: Pt; r: number }[]
  dots?: { c: Pt; r: number }[]
}

const SIZE = 2 // world width of the 48-unit-wide logo
const S = SIZE / 48
const SPREAD = 1.1 // trace half-thickness, logo units

/** Consecutive points → line segments. */
const polyline = (...pts: Pt[]) => pts.slice(1).map((p, i) => [pts[i], p] as [Pt, Pt])

const HM: Shape = {
  lines: [
    ...polyline([8, 10], [8, 54]),
    ...polyline([22.5, 10], [22.5, 54]),
    ...polyline([8, 32], [22.5, 32]),
    ...polyline([37, 54], [37, 10], [46.5, 19.5], [56, 10], [56, 54]),
  ],
  rings: ([[8, 10], [8, 54], [22.5, 10], [22.5, 54], [37, 54], [56, 54]] as Pt[]).map((c) => ({ c, r: 3.4 })),
  dots: ([[8, 32], [22.5, 32], [46.5, 19.5]] as Pt[]).map((c) => ({ c, r: 1.9 })),
}

const LAPTOP: Shape = {
  lines: [
    // Screen bezel, with three lines of "code" on it.
    ...polyline([12, 12], [52, 12], [52, 40], [12, 40], [12, 12]),
    ...polyline([17, 19], [31, 19]),
    ...polyline([21, 25], [42, 25]),
    ...polyline([21, 31], [36, 31]),
    // Keyboard deck seen from the front, with a trackpad notch.
    ...polyline([6, 44], [58, 44], [54, 50], [10, 50], [6, 44]),
    ...polyline([27, 47], [37, 47]),
  ],
  dots: [{ c: [32, 15], r: 0.9 }],
}

const CODE: Shape = {
  lines: [
    ...polyline([22, 18], [9, 32], [22, 46]),
    ...polyline([37, 13], [27, 51]),
    ...polyline([42, 18], [55, 32], [42, 46]),
  ],
  dots: [
    { c: [9, 32], r: 1.6 },
    { c: [55, 32], r: 1.6 },
  ],
}

const SHAPES = [HM, LAPTOP, CODE]

// Timeline of one loop, in seconds. Whatever is left of CYCLE after burst is drift.
const CYCLE = 9.5
const GATHER = 2.6
const HOLD = 3.4
const BURST = 1.1

const CYAN = new THREE.Color('#22d3ee')
const VIOLET = new THREE.Color('#a78bfa')
const WHITE = new THREE.Color('#ffffff')

/** Small deterministic PRNG so the swarm looks the same on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Random point on a shape, weighted by length so density is even: along a line, a ring, or inside a dot. */
function sample(shape: Shape, rand: () => number): Pt {
  const rings = shape.rings ?? []
  const dots = shape.dots ?? []
  const lineLen = shape.lines.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]))
  const ringLen = rings.map(({ r }) => 2 * Math.PI * r)
  const dotArea = dots.map(({ r }) => 3 * r * r)
  const total = [...lineLen, ...ringLen, ...dotArea].reduce((s, l) => s + l, 0)
  let pick = rand() * total

  for (let i = 0; i < shape.lines.length; i++) {
    if ((pick -= lineLen[i]) < 0) {
      const [a, b] = shape.lines[i]
      const u = rand()
      const nx = -(b[1] - a[1]) / lineLen[i]
      const ny = (b[0] - a[0]) / lineLen[i]
      const off = (rand() * 2 - 1) * SPREAD
      return [a[0] + (b[0] - a[0]) * u + nx * off, a[1] + (b[1] - a[1]) * u + ny * off]
    }
  }
  for (let i = 0; i < rings.length; i++) {
    if ((pick -= ringLen[i]) < 0) {
      const { c, r } = rings[i]
      const a = rand() * Math.PI * 2
      const rr = r + (rand() * 2 - 1) * SPREAD * 0.8
      return [c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr]
    }
  }
  const { c, r } = dots[Math.min(dots.length - 1, Math.floor(rand() * dots.length))]
  const a = rand() * Math.PI * 2
  const rr = Math.sqrt(rand()) * r
  return [c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr]
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,0.85)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x))

export function ParticleLogo({ count = 3200, reduce = false }: { count?: number; reduce?: boolean }) {
  const group = useRef<THREE.Group>(null!)
  const points = useRef<THREE.Points>(null!)
  const material = useRef<THREE.PointsMaterial>(null!)
  // Own timer instead of state.clock: R3F zeroes the clock whenever the hero pauses the canvas
  // (frameloop 'never' while scrolled away), which would throw the timeline back to a negative time.
  const elapsed = useRef(0)

  const data = useMemo(() => {
    const rand = mulberry32(7)
    const v = new THREE.Vector3()
    const c = new THREE.Color()
    const sparkle = new Float32Array(count).map(() => rand() * 0.35)

    // One target layout (and matching gradient colours) per shape.
    const targets = SHAPES.map(() => new Float32Array(count * 3))
    const colors = SHAPES.map(() => new Float32Array(count * 3))
    SHAPES.forEach((shape, s) => {
      for (let i = 0; i < count; i++) {
        const pt = sample(shape, rand)
        v.set((pt[0] - 32) * S, (32 - pt[1]) * S, (rand() * 2 - 1) * SPREAD * S).toArray(targets[s], i * 3)
        // Same cyan → violet diagonal as the 2D logo's gradient.
        const t = clamp01(((pt[0] - 4) * 56 + (pt[1] - 6) * 52) / (56 * 56 + 52 * 52))
        c.copy(CYAN).lerp(VIOLET, t).lerp(WHITE, sparkle[i]).toArray(colors[s], i * 3)
      }
    })

    const scatter = new Float32Array(count * 3)
    const delay = new Float32Array(count)
    const swirl = new Float32Array(count)
    const phase = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Cloud around the sphere: a thick shell, a little flattened toward the camera.
      v.set(rand() * 2 - 1, rand() * 2 - 1, (rand() * 2 - 1) * 0.7).normalize()
      v.multiplyScalar(1.5 + rand() * 1.8).toArray(scatter, i * 3)
      delay[i] = rand()
      swirl[i] = 1.2 + rand() * 2.2
      phase[i] = rand() * Math.PI * 2
    }

    const position = new Float32Array(reduce ? targets[0] : scatter)
    const color = new Float32Array(colors[0])
    return { targets, colors, scatter, position, color, delay, swirl, phase }
  }, [count, reduce])

  const texture = useMemo(glowTexture, [])
  useEffect(() => () => texture.dispose(), [texture])

  useFrame((state, delta) => {
    // Capped so a long hidden tab resumes where it left off instead of skipping ahead.
    elapsed.current += Math.min(delta, 0.1)
    const t = elapsed.current
    const g = group.current

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, (reduce ? 0 : Math.sin(t * 0.5) * 0.35) + state.pointer.x * 0.35, 3, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.25, 3, delta)
    if (reduce) return

    const { targets, colors, scatter, position, color, delay, swirl, phase } = data
    const loop = Math.floor(t / CYCLE)
    const tau = t % CYCLE
    const target = targets[loop % SHAPES.length]
    const toColor = colors[loop % SHAPES.length]
    const fromColor = colors[(loop + SHAPES.length - 1) % SHAPES.length]
    const drift = t * 0.12

    // Glow flashes when the shape locks in and when it bursts.
    const lockFlash = tau > GATHER - 0.2 ? Math.exp(-Math.max(0, tau - GATHER) * 4) : 0
    const burstFlash = tau > GATHER + HOLD ? Math.exp(-(tau - GATHER - HOLD) * 5) : 0
    material.current.size = 0.042 * (1 + 0.5 * lockFlash + 0.9 * burstFlash)
    material.current.opacity = clamp01(t / 0.8)

    for (let i = 0; i < count; i++) {
      const j = i * 3
      // Drifting cloud position: the scatter shell slowly turning, with a soft bob.
      const cos = Math.cos(drift + delay[i] * 0.6)
      const sin = Math.sin(drift + delay[i] * 0.6)
      const sx = scatter[j] * cos - scatter[j + 2] * sin
      const sz = scatter[j] * sin + scatter[j + 2] * cos
      const sy = scatter[j + 1] + Math.sin(t * 0.7 + phase[i]) * 0.08
      const tx = target[j]
      const ty = target[j + 1]
      const tz = target[j + 2]

      let x: number, y: number, z: number
      if (tau < GATHER) {
        // Staggered arrival along a vortex: each particle spirals in around the vertical axis.
        const e = easeInOut(clamp01((tau - delay[i] * 0.9) / (GATHER - 0.9)))
        const a = (1 - e) * swirl[i]
        const mx = sx + (tx - sx) * e
        const mz = sz + (tz - sz) * e
        x = mx * Math.cos(a) - mz * Math.sin(a)
        z = mx * Math.sin(a) + mz * Math.cos(a)
        y = sy + (ty - sy) * e
        // Colours blend from the last shape's gradient to this one's as particles arrive.
        for (let k = 0; k < 3; k++) color[j + k] = fromColor[j + k] + (toColor[j + k] - fromColor[j + k]) * e
      } else if (tau < GATHER + HOLD) {
        // Locked in, with a faint shimmer so it feels alive.
        const w = 0.006
        x = tx + Math.sin(t * 3 + phase[i]) * w
        y = ty + Math.cos(t * 2.6 + phase[i]) * w
        z = tz + Math.sin(t * 2.2 + phase[i] * 1.7) * w * 2
      } else {
        // Burst outward fast, then settle into the drifting cloud.
        const e = easeOutExpo(clamp01((tau - GATHER - HOLD - delay[i] * 0.25) / BURST))
        x = tx + (sx - tx) * e
        y = ty + (sy - ty) * e
        z = tz + (sz - tz) * e
      }
      position[j] = x
      position[j + 1] = y
      position[j + 2] = z
    }
    const geo = points.current.geometry
    geo.attributes.position.needsUpdate = true
    if (tau < GATHER) geo.attributes.color.needsUpdate = true
  })

  return (
    <group ref={group}>
      <points ref={points} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.position, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.color, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={material}
          map={texture}
          size={0.042}
          sizeAttenuation
          vertexColors
          transparent
          opacity={reduce ? 1 : 0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  )
}
