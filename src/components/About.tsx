import type { RefObject } from 'react'
import { Code2, Network, Lightbulb } from 'lucide-react'
import { personal } from '../data/portfolio'
import { useInView } from '../hooks/useInView'

const highlights = [
  {
    icon: Code2,
    title: 'Web Development',
    desc: 'WordPress, PHP, React, ASP.NET — building performant, responsive websites.',
  },
  {
    icon: Network,
    title: 'IT & Networking',
    desc: 'TCP/IP, LAN/WAN, DNS/DHCP — configuring and troubleshooting real networks.',
  },
  {
    icon: Lightbulb,
    title: 'Problem Solver',
    desc: 'Analytical mindset with a passion for debugging and finding elegant solutions.',
  },
]

export default function About() {
  const { ref, inView } = useInView()

  return (
    <section id="about" className="section-padding bg-navy-900/40">
      <div
        ref={ref as RefObject<HTMLDivElement>}
        className={`max-container transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
          About <span className="gradient-text">Me</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-10" />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">{personal.summary}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-navy-800/60 rounded-lg p-4 border border-slate-700/50">
                <p className="text-slate-500 mb-1">Location</p>
                <p className="text-slate-200 font-medium">{personal.location}</p>
              </div>
              <div className="bg-navy-800/60 rounded-lg p-4 border border-slate-700/50">
                <p className="text-slate-500 mb-1">Degree</p>
                <p className="text-slate-200 font-medium">BSc Computer Science</p>
              </div>
              <div className="bg-navy-800/60 rounded-lg p-4 border border-slate-700/50">
                <p className="text-slate-500 mb-1">Experience</p>
                <p className="text-slate-200 font-medium">~2 Years</p>
              </div>
              <div className="bg-navy-800/60 rounded-lg p-4 border border-slate-700/50">
                <p className="text-slate-500 mb-1">Status</p>
                <p className="text-cyan-400 font-medium">Open to Work</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="card-glow rounded-xl p-5 flex items-start gap-4"
              >
                <div className="p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shrink-0">
                  <Icon size={22} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
