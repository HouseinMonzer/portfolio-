import { useState, useEffect } from 'react'
import { Menu, X, Github, Linkedin } from 'lucide-react'
import { personal } from '../data/portfolio'

const links = ['About', 'Skills', 'Experience', 'Projects', 'Education', 'Contact']

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setOpen(false)
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-navy-900/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
    }`}>
      <div className="max-container flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => scrollTo('hero')}
          className="font-mono text-xl font-bold gradient-text hover:opacity-80 transition-opacity"
        >
          HM<span className="text-cyan-400">.</span>
        </button>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link}>
              <button
                onClick={() => scrollTo(link)}
                className="text-slate-400 hover:text-cyan-400 transition-colors text-sm font-medium tracking-wide"
              >
                {link}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-cyan-400 hover:bg-navy-800/60 transition-colors"
          >
            <Github size={16} />
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-cyan-400 hover:bg-navy-800/60 transition-colors"
          >
            <Linkedin size={16} />
          </a>
        </div>

        <button
          className="md:hidden text-slate-300 hover:text-cyan-400 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-navy-900/98 backdrop-blur-md border-t border-slate-800">
          <ul className="flex flex-col py-4 px-6 gap-4">
            {links.map((link) => (
              <li key={link}>
                <button
                  onClick={() => scrollTo(link)}
                  className="text-slate-300 hover:text-cyan-400 transition-colors w-full text-left py-1"
                >
                  {link}
                </button>
              </li>
            ))}
            <li className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <a href={personal.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                className="text-slate-300 hover:text-cyan-400 transition-colors">
                <Github size={18} />
              </a>
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="text-slate-300 hover:text-cyan-400 transition-colors">
                <Linkedin size={18} />
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
