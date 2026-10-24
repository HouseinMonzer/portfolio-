import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ParticleLogo } from './ParticleLogo'

const CYAN = '#22d3ee'
const VIOLET = '#8b5cf6'

/** The HM particle swarm at the centre of a wireframe shell and orbit rings with satellites. */
function Core({ reduce, particles }: { reduce: boolean; particles: number }) {
  const group = useRef<THREE.Group>(null!)
  const spin = useRef<THREE.Group>(null!)
  const shell = useRef<THREE.Mesh>(null!)
  const satA = useRef<THREE.Mesh>(null!)
  const satB = useRef<THREE.Mesh>(null!)
  const { viewport } = useThree()

  // Desktop: sits to the right of the headline. Mobile: top-right above the headline, with the whole HM on screen.
  const wide = viewport.width > 7
  const baseX = wide ? Math.min(viewport.width * 0.24, 3.4) : viewport.width * 0.2
  const baseY = wide ? 0 : viewport.height * 0.3
  const baseScale = wide ? 1 : 0.55

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.2)
    const g = group.current
    const s = spin.current

    // Follow the pointer with a soft lag, drift away on scroll. Only the shell and rings spin; the logo stays readable.
    s.rotation.y = THREE.MathUtils.damp(s.rotation.y, state.pointer.x * 0.5 + t * 0.08, 3, delta)
    s.rotation.x = THREE.MathUtils.damp(s.rotation.x, -state.pointer.y * 0.35 + scroll * 0.6, 3, delta)
    g.position.x = THREE.MathUtils.damp(g.position.x, baseX, 4, delta)
    g.position.y = THREE.MathUtils.damp(g.position.y, baseY + scroll * 1.6, 6, delta)
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, baseScale * (1 - scroll * 0.25), 6, delta))

    shell.current.rotation.x -= delta * 0.12
    shell.current.rotation.z += delta * 0.08

    satA.current.position.set(Math.cos(t * 0.7) * 2.6, 0, Math.sin(t * 0.7) * 2.6)
    satB.current.position.set(Math.cos(-t * 0.5 + 2) * 2.15, Math.sin(-t * 0.5 + 2) * 2.15, 0)
  })

  return (
    <group ref={group} position={[baseX, baseY, 0]} scale={baseScale}>
      <group ref={spin}>
        <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.9}>
          <mesh ref={shell} scale={1.85}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.16} />
          </mesh>

          <group rotation={[Math.PI / 2.3, 0, 0]}>
            <mesh>
              <torusGeometry args={[2.6, 0.006, 8, 220]} />
              <meshBasicMaterial color={CYAN} transparent opacity={0.45} />
            </mesh>
            <mesh ref={satA}>
              <sphereGeometry args={[0.07, 24, 24]} />
              <meshBasicMaterial color={CYAN} toneMapped={false} />
            </mesh>
          </group>

          <group rotation={[0.4, 0.9, 0]}>
            <mesh>
              <torusGeometry args={[2.15, 0.005, 8, 200]} />
              <meshBasicMaterial color={VIOLET} transparent opacity={0.4} />
            </mesh>
            <mesh ref={satB}>
              <sphereGeometry args={[0.055, 24, 24]} />
              <meshBasicMaterial color={VIOLET} toneMapped={false} />
            </mesh>
          </group>
        </Float>
      </group>
      <ParticleLogo reduce={reduce} count={particles} />
    </group>
  )
}

/** Deep-space particle field that slowly rotates for parallax depth. */
function Starfield({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 12
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi) - 4
    }
    return arr
  }, [count])

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.012
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, state.pointer.y * 0.06, 2, delta)
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#94e9f7" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/** Subtle camera parallax toward the pointer. */
function Rig() {
  useFrame((state, delta) => {
    const cam = state.camera
    cam.position.x = THREE.MathUtils.damp(cam.position.x, state.pointer.x * 0.5, 2, delta)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, state.pointer.y * 0.35, 2, delta)
    cam.lookAt(0, 0, 0)
  })
  return null
}

export default function HeroScene({ frameloop = 'always' }: { frameloop?: 'always' | 'demand' | 'never' }) {
  const lowPower = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency ?? 8) <= 4

  return (
    <Canvas
      dpr={[1, lowPower ? 1.25 : 1.75]}
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: 'high-performance' }}
      frameloop={frameloop}
      eventSource={typeof document !== 'undefined' ? document.body : undefined}
      eventPrefix="client"
    >
      <Core reduce={frameloop === 'demand'} particles={lowPower ? 1600 : 3200} />
      <Starfield count={lowPower ? 700 : 1400} />
      <Sparkles count={lowPower ? 20 : 45} scale={[9, 5, 4]} size={2.2} speed={0.35} opacity={0.6} color="#67e8f9" />
      <Rig />
    </Canvas>
  )
}
