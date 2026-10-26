// Renders the "new design" launch visuals to PNG with headless Chrome.
// Usage: node brand/social/launch/build-launch.mjs
// Screenshots in img/ come from the live site (see mobile-frame.html for the phone capture).
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'

const here = dirname(fileURLToPath(import.meta.url))
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = join(here, '..', 'png')
mkdirSync(out, { recursive: true })

for (const [name, w, h] of [['story', 1080, 1920], ['linkedin', 1080, 1350]]) {
  const png = join(out, `launch-${name}.png`)
  execFileSync(CHROME, ['--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=${w},${h}`,
    '--virtual-time-budget=6000', `--screenshot=${png}`, pathToFileURL(join(here, `${name}.html`)).href], { stdio: 'ignore' })
  console.log(`launch-${name}.png ${w}x${h}`)
}
