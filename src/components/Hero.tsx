import type { RefObject } from 'react'
import { MapPin, Mail, Phone, Linkedin, Github, Download, ArrowDown } from 'lucide-react'
import { personal } from '../data/portfolio'
import { useTypewriter } from '../hooks/useTypewriter'
import { useInView } from '../hooks/useInView'

export default function Hero() {
  const typed = useTypewriter(personal.roles)
  const { ref, inView } = useInView()

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />

      <div
        ref={ref as RefObject<HTMLDivElement>}
        className={`relative max-container w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-16">

          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-navy-800/80 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-6 text-sm text-cyan-400 font-mono">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              Available for opportunities
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 tracking-tight leading-tight">
              <span className="text-white">Housein</span>{' '}
              <span className="gradient-text">Monzer</span>
            </h1>

            <div className="h-9 mb-5 flex items-center justify-center lg:justify-start">
              <span className="text-lg sm:text-xl lg:text-2xl font-mono text-slate-300">
                {typed}
                <span className="text-cyan-400 animate-[blink_1s_step-end_infinite]">|</span>
              </span>
            </div>

            <p className="max-w-xl mx-auto lg:mx-0 text-slate-400 text-base sm:text-lg leading-relaxed mb-8">
              Full-stack developer building React + TypeScript applications. Currently shipping
              <span className="text-cyan-400"> SouQna</span>, a multi-vendor marketplace for Lebanon.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8">
              <a href={`mailto:${personal.email}`}
                className="flex items-center gap-1.5 bg-navy-800/60 border border-slate-700 hover:border-cyan-500/60 rounded-full px-3 py-1.5 text-xs text-slate-300 hover:text-cyan-400 transition-all">
                <Mail size={12} />
                <span className="hidden sm:inline">{personal.email}</span>
                <span className="sm:hidden">Email</span>
              </a>
              <a href={`tel:${personal.phone}`}
                className="flex items-center gap-1.5 bg-navy-800/60 border border-slate-700 hover:border-cyan-500/60 rounded-full px-3 py-1.5 text-xs text-slate-300 hover:text-cyan-400 transition-all">
                <Phone size={12} />
                {personal.phone}
              </a>
              <span className="flex items-center gap-1.5 bg-navy-800/60 border border-slate-700 rounded-full px-3 py-1.5 text-xs text-slate-300">
                <MapPin size={12} />
                {personal.location}
              </span>
              <a href={personal.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-navy-800/60 border border-slate-700 hover:border-cyan-500/60 rounded-full px-3 py-1.5 text-xs text-slate-300 hover:text-cyan-400 transition-all">
                <Github size={12} />
                GitHub
              </a>
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-navy-800/60 border border-slate-700 hover:border-cyan-500/60 rounded-full px-3 py-1.5 text-xs text-slate-300 hover:text-cyan-400 transition-all">
                <Linkedin size={12} />
                LinkedIn
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-7 py-2.5 rounded-full transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 text-sm">
                View My Work
              </button>
              <a
                href={personal.cv}
                download
                className="inline-flex items-center gap-2 border border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 font-semibold px-7 py-2.5 rounded-full transition-all text-sm">
                <Download size={15} /> Download CV
              </a>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-slate-400 hover:text-cyan-400 font-semibold px-3 py-2.5 transition-all text-sm">
                Get In Touch →
              </button>
            </div>
          </div>

          {/* Right: Avatar */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-56 h-16 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />
              <img
                src="/avatar.png"
                alt="Housein Monzer"
                className="avatar-3d relative w-64 h-64 sm:w-72 sm:h-72 lg:w-[340px] lg:h-[340px] xl:w-[380px] xl:h-[380px] object-contain"
                style={{ filter: 'drop-shadow(0 24px 48px rgba(6,182,212,0.22)) drop-shadow(0 8px 20px rgba(0,0,0,0.55))' }}
              />
              <div className="absolute top-8 -left-2 sm:-left-4 bg-navy-800/95 border border-green-500/50 rounded-xl px-3 py-2 shadow-lg shadow-black/40 backdrop-blur-sm z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
                  <p className="text-xs text-green-400 font-semibold whitespace-nowrap">Open to Work</p>
                </div>
              </div>
              <div className="absolute bottom-10 -right-2 sm:-right-4 bg-navy-800/95 border border-cyan-500/40 rounded-xl px-3 py-2 shadow-lg shadow-black/40 backdrop-blur-sm text-right z-10">
                <p className="text-[10px] text-slate-400 leading-none mb-0.5">Experience</p>
                <p className="text-sm font-bold text-cyan-400 leading-none">~2 Years</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 text-center animate-bounce text-slate-500">
          <ArrowDown size={20} className="mx-auto" />
        </div>
      </div>
    </section>
  )
}
