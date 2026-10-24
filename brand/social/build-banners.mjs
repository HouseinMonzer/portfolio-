// Generates the circuit-style cover banners (SVG + PNG) for LinkedIn, X and Facebook,
// plus the site's Open Graph share image (written to public/og-image.png).
// Usage: node brand/social/build-banners.mjs   (needs Google Chrome installed for the PNG export)
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'

const here = dirname(fileURLToPath(import.meta.url))
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const FONTS = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600&family=JetBrains+Mono:wght@500&family=Inter:wght@500&display=swap'

const banners = [
  {
    file: 'banner-linkedin', w: 1584, h: 396,
    text: { x: 600, label: 122, name: 188, role: 232, skills: 272, sizes: [18, 60, 24, 20], anchor: 'start' },
    mark: { x: 1385, y: 198, s: 0.34 },
    glows: [{ x: 1385, y: 198, r: 360, c: '#22d3ee', o: 0.16 }, { x: 760, y: 420, r: 420, c: '#8b5cf6', o: 0.12 }],
    groups: [
      { dir: 1, n: 5, y0: 78, y1: 318, bendAt: 150, dy: -46, endAt: 430 },
      { dir: -1, n: 3, y0: 290, y1: 354, bendAt: 1230, dy: 30, endAt: 1110, from: 1584 },
    ],
  },
  {
    file: 'banner-x', w: 1500, h: 500,
    text: { x: 560, label: 168, name: 240, role: 290, skills: 334, sizes: [20, 66, 26, 22], anchor: 'start' },
    mark: { x: 1300, y: 250, s: 0.42 },
    glows: [{ x: 1300, y: 250, r: 420, c: '#22d3ee', o: 0.16 }, { x: 700, y: 520, r: 460, c: '#8b5cf6', o: 0.12 }],
    groups: [
      { dir: 1, n: 6, y0: 96, y1: 404, bendAt: 140, dy: -50, endAt: 400 },
      { dir: -1, n: 3, y0: 404, y1: 460, bendAt: 1160, dy: 26, endAt: 1030, from: 1500 },
    ],
  },
  {
    file: 'banner-facebook', w: 1640, h: 624,
    text: { x: 820, label: null, name: 350, role: 404, skills: 452, sizes: [0, 78, 28, 24], anchor: 'middle' },
    mark: { x: 820, y: 168, s: 0.27 },
    glows: [{ x: 820, y: 260, r: 520, c: '#22d3ee', o: 0.14 }, { x: 820, y: 680, r: 520, c: '#8b5cf6', o: 0.14 }],
    groups: [
      { dir: 1, n: 6, y0: 120, y1: 500, bendAt: 120, dy: -56, endAt: 330 },
      { dir: -1, n: 6, y0: 120, y1: 500, bendAt: 1520, dy: 56, endAt: 1310, from: 1640 },
    ],
  },
  {
    // Open Graph / Twitter share image. Centered so square crops (WhatsApp, Slack) keep the name.
    file: 'og-image', w: 1200, h: 630, out: join(here, '..', '..', 'public'),
    text: { x: 600, label: null, name: 346, role: 400, skills: 448, url: 548, sizes: [0, 72, 28, 23, 20], anchor: 'middle' },
    mark: { x: 600, y: 166, s: 0.27 },
    glows: [{ x: 600, y: 260, r: 460, c: '#22d3ee', o: 0.15 }, { x: 600, y: 700, r: 480, c: '#8b5cf6', o: 0.15 }],
    groups: [
      { dir: 1, n: 5, y0: 110, y1: 540, bendAt: 40, dy: -40, step: 28, endAt: 150 },
      { dir: -1, n: 5, y0: 110, y1: 540, bendAt: 1160, dy: 40, step: 28, endAt: 1050, from: 1200 },
    ],
  },
]

// A bus of parallel PCB traces that enter from one edge, take one 45° bend and end in a node.
// Bends are staggered so the diagonals stay parallel and never cross.
function traceGroup(g, gi) {
  const { dir, n, y0, y1, bendAt, dy, endAt } = g
  const start = dir > 0 ? -10 : g.from + 10
  const gap = (y1 - y0) / (n - 1)
  const step = g.step ?? gap * 0.6
  const out = []
  for (let i = 0; i < n; i++) {
    const y = y0 + i * gap
    // Upward bend: upper traces bend first. Downward bend: lower traces bend first.
    const order = dy < 0 ? i : n - 1 - i
    const xb = bendAt + dir * order * step
    const xd = xb + dir * Math.abs(dy)
    // Ragged end points, but always past the diagonal so a trace never doubles back.
    const jitter = endAt + dir * ((i * 37 + gi * 53) % 5) * 34
    const xe = dir > 0 ? Math.max(jitter, xd + 70) : Math.min(jitter, xd - 70)
    const lit = (i + gi) % 3 === 1
    out.push({ d: `M${start} ${y}H${xb}L${xd} ${y + dy}H${xe}`, end: [xe, y + dy], lit })
  }
  return out
}

function markGroup({ x, y, s }) {
  return `<g transform="translate(${x} ${y}) scale(${s}) translate(-540 -540)" filter="url(#neon)">
    <path d="M310 330v420M450 330v420M310 540h140M590 750V330l90 90 90-90v420" fill="none" stroke="url(#mark)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
    <g fill="#04060b" stroke="url(#mark)" stroke-width="12">
      <circle cx="310" cy="330" r="26"/><circle cx="310" cy="750" r="26"/><circle cx="450" cy="330" r="26"/>
      <circle cx="450" cy="750" r="26"/><circle cx="590" cy="750" r="26"/><circle cx="770" cy="750" r="26"/>
    </g>
    <g fill="#e2e8f0"><circle cx="310" cy="540" r="16"/><circle cx="450" cy="540" r="16"/><circle cx="680" cy="420" r="16"/></g>
  </g>`
}

function svgFor(b) {
  const traces = b.groups.flatMap(traceGroup)
  const t = b.text
  const [labelSize, nameSize, roleSize, skillSize, urlSize] = t.sizes
  const sep = '<tspan fill="#475569">   ·   </tspan>'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${b.w} ${b.h}" width="${b.w}" height="${b.h}">
  <style>@import url('${FONTS.replace(/&/g, '&amp;')}');</style>
  <defs>
    <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="16" cy="16" r="1.6" fill="#161d31"/></pattern>
    <linearGradient id="mark" x1="310" y1="330" x2="770" y2="750" gradientUnits="userSpaceOnUse"><stop stop-color="#22d3ee"/><stop offset="1" stop-color="#a78bfa"/></linearGradient>
    <linearGradient id="lit" x1="0" y1="0" x2="${b.w}" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#22d3ee"/><stop offset="1" stop-color="#a78bfa"/></linearGradient>
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#cbd5e1"/></linearGradient>
    <filter id="neon" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    ${b.glows.map((g, i) => `<radialGradient id="glow${i}" cx="${g.x}" cy="${g.y}" r="${g.r}" gradientUnits="userSpaceOnUse"><stop stop-color="${g.c}" stop-opacity="${g.o}"/><stop offset="1" stop-color="${g.c}" stop-opacity="0"/></radialGradient>`).join('\n    ')}
  </defs>
  <rect width="${b.w}" height="${b.h}" fill="#04060b"/>
  <rect width="${b.w}" height="${b.h}" fill="url(#dots)"/>
  ${b.glows.map((_, i) => `<rect width="${b.w}" height="${b.h}" fill="url(#glow${i})"/>`).join('\n  ')}
  <g fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    ${traces.filter((r) => !r.lit).map((r) => `<path d="${r.d}" stroke="#1e2740"/>`).join('\n    ')}
    <g filter="url(#soft)">${traces.filter((r) => r.lit).map((r) => `<path d="${r.d}" stroke="url(#lit)" stroke-opacity=".85"/>`).join('')}</g>
  </g>
  <g stroke-width="4">
    ${traces.map((r) => `<circle cx="${r.end[0]}" cy="${r.end[1]}" r="8" fill="#04060b" stroke="${r.lit ? '#22d3ee' : '#2a3452'}"/>`).join('\n    ')}
  </g>
  ${markGroup(b.mark)}
  <g text-anchor="${t.anchor}">
    ${t.label ? `<text x="${t.x}" y="${t.label}" font-family="'JetBrains Mono', Consolas, monospace" font-size="${labelSize}" font-weight="500" fill="#64748b">// hello, I'm</text>` : ''}
    <text x="${t.x}" y="${t.name}" font-family="'Space Grotesk', 'Segoe UI', sans-serif" font-size="${nameSize}" font-weight="600" fill="url(#name)" letter-spacing="-1">Housein Monzer</text>
    <text x="${t.x}" y="${t.role}" font-family="'JetBrains Mono', Consolas, monospace" font-size="${roleSize}" font-weight="500" fill="#22d3ee"><tspan fill="#a78bfa">&gt;</tspan> Full-Stack Developer</text>
    <text x="${t.x}" y="${t.skills}" font-family="Inter, 'Segoe UI', sans-serif" font-size="${skillSize}" font-weight="500" fill="#94a3b8" style="white-space:pre">React${sep}TypeScript${sep}Node.js${sep}PostgreSQL</text>
    ${t.url ? `<text x="${t.x}" y="${t.url}" font-family="'JetBrains Mono', Consolas, monospace" font-size="${urlSize}" font-weight="500" fill="#64748b">houseinmonzer.vercel.app</text>` : ''}
  </g>
</svg>`
}

const svgDir = join(here, 'svg')
const pngDir = join(here, 'png')
const work = join(tmpdir(), 'hm-banner-render')
for (const d of [svgDir, pngDir, work]) mkdirSync(d, { recursive: true })

for (const b of banners) {
  const svg = svgFor(b)
  writeFileSync(join(svgDir, `${b.file}.svg`), svg)
  const png = join(b.out ?? pngDir, `${b.file}.png`)
  const html = join(work, `${b.file}.html`)
  writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTS}" rel="stylesheet">
<style>html,body{margin:0;overflow:hidden}svg{display:block}</style></head><body>${svg}</body></html>`)
  execFileSync(CHROME, ['--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1',
    `--window-size=${b.w},${b.h}`, '--virtual-time-budget=6000', `--screenshot=${png}`,
    pathToFileURL(html).href], { stdio: 'ignore' })
  console.log(`${b.file}: ${b.w}x${b.h}`)
}
