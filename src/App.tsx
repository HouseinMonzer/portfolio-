import { Analytics } from '@vercel/analytics/react'
import { MotionConfig } from 'framer-motion'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import ScrollProgress from './components/ScrollProgress'
import CommandPalette from './components/CommandPalette'
import { initSmoothScroll, scrollToId } from './lib/scroll'

export default function App() {
  const [ready, setReady] = useState(false)
  const [loaderGone, setLoaderGone] = useState(false)
  const [palette, setPalette] = useState(false)

  useEffect(() => initSmoothScroll(), [])

  // ⌘K / Ctrl+K opens the command palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Honor deep links like /#projects once the intro has finished.
  useEffect(() => {
    if (!ready) return
    const id = location.hash.slice(1)
    if (id) setTimeout(() => scrollToId(id), 300)
    const t = setTimeout(() => setLoaderGone(true), 1400)
    return () => clearTimeout(t)
  }, [ready])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only z-[200] rounded-full bg-white px-4 py-2 text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      {!loaderGone && <Preloader onDone={() => setReady(true)} />}
      <ScrollProgress />
      <Cursor />
      <Navbar onOpenPalette={() => setPalette(true)} />
      <CommandPalette open={palette} onClose={() => setPalette(false)} />

      <main id="main">
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />

      {/* Film-grain overlay for depth */}
      <div aria-hidden className="noise pointer-events-none fixed inset-0 z-[70] opacity-[0.035] mix-blend-overlay" />
      <Analytics />
    </MotionConfig>
  )
}
