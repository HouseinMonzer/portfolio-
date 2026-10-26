// Converts images to resized WebP using Chrome's own encoder (no extra dependencies).
//
// Usage:
//   node scripts/webp.mjs <out-dir> <image...> [--max 1600] [--quality 82]
// Example:
//   node scripts/webp.mjs public/work/luxury-watch ~/Downloads/watch-*.png --max 1600
//
// Prints each output's width × height, ready to paste into src/data/visuals.ts.
import { spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const args = process.argv.slice(2)
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : Number(args.splice(i, 2)[1])
}
const max = opt('max', 1600)
const quality = opt('quality', 82) / 100
const [outDir, ...inputs] = args
if (!outDir || inputs.length === 0) {
  console.error('Usage: node scripts/webp.mjs <out-dir> <image...> [--max 1600] [--quality 82]')
  process.exit(1)
}
mkdirSync(outDir, { recursive: true })

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif' }
const profile = mkdtempSync(join(tmpdir(), 'webp-chrome-'))
const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })

try {
  // Chrome writes the port it picked to DevToolsActivePort.
  const portFile = join(profile, 'DevToolsActivePort')
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await new Promise((r) => setTimeout(r, 100))
  const port = readFileSync(portFile, 'utf8').split('\n')[0]
  const page = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()

  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((r, j) => ((ws.onopen = r), (ws.onerror = j)))
  let seq = 0
  const pending = new Map()
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data)
    if (pending.has(msg.id)) pending.get(msg.id)(msg)
  }
  const send = (method, params) =>
    new Promise((res, rej) => {
      const id = ++seq
      pending.set(id, (m) => (m.error ? rej(new Error(m.error.message)) : res(m.result)))
      ws.send(JSON.stringify({ id, method, params }))
    })

  for (const input of inputs) {
    const file = resolve(input)
    const mime = MIME[extname(file).toLowerCase()]
    if (!mime) {
      console.warn(`skip (unsupported type): ${input}`)
      continue
    }
    const dataUrl = `data:${mime};base64,${readFileSync(file).toString('base64')}`
    const { result } = await send('Runtime.evaluate', {
      awaitPromise: true,
      returnByValue: true,
      expression: `(async () => {
        const img = new Image(); img.src = ${JSON.stringify(dataUrl)}; await img.decode();
        const scale = Math.min(1, ${max} / img.naturalWidth);
        const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        const ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, w, h);
        return { w, h, data: c.toDataURL('image/webp', ${quality}).split(',')[1] };
      })()`,
    })
    const { w, h, data } = result.value
    const out = join(outDir, `${basename(file, extname(file))}.webp`)
    const bytes = Buffer.from(data, 'base64')
    writeFileSync(out, bytes)
    console.log(`${out.replace(/\\/g, '/')}  ${w}×${h}  ${Math.round(bytes.length / 1024)}KB`)
  }
  ws.close()
} finally {
  chrome.kill()
  await new Promise((r) => setTimeout(r, 300))
  rmSync(profile, { recursive: true, force: true })
}
