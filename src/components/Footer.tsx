import { Github, Linkedin, Mail } from 'lucide-react'
import { personal } from '../data/portfolio'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-container flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-sm">
          © {year}{' '}
          <span className="gradient-text font-semibold">{personal.name}</span>
          <span className="hidden sm:inline"> · Built with React + Vite</span>
        </p>
        <div className="flex items-center gap-2">
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-700 hover:border-cyan-500 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Github size={15} />
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-700 hover:border-cyan-500 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Linkedin size={15} />
          </a>
          <a
            href={`mailto:${personal.email}`}
            aria-label="Email"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-700 hover:border-cyan-500 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Mail size={15} />
          </a>
        </div>
      </div>
    </footer>
  )
}
