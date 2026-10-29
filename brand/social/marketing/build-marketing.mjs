// Marketing visuals for the AI visual services: price lists (EN + AR) built from src/data/pricing.json,
// three service promo posts and a Story, all using real portfolio images from public/work.
// Usage: node brand/social/marketing/build-marketing.mjs   →  brand/social/png/marketing-*.png
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..', '..', '..')
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const pricing = JSON.parse(readFileSync(join(root, 'src/data/pricing.json'), 'utf8'))
const out = join(here, '..', 'png')
mkdirSync(out, { recursive: true })

const work = (f) => `../../../public/work/${f}`
const URL_TEXT = 'houseinmonzer<i>.vercel.app</i>'
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const escAr = (s) => esc(s).replace(/(\d+(?:[–-]\d+)?\$?)/g, '<bdi>$1</bdi>')
const byId = (id) => pricing.visuals.find((p) => p.id === id)
const from = (id) => `${pricing.currency}${byId(id).price}`

const LOGO = `<svg viewBox="0 0 64 64" fill="none"><defs><linearGradient id="lg" x1="4" y1="6" x2="60" y2="58" gradientUnits="userSpaceOnUse"><stop stop-color="#22d3ee"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs><path d="M8 10v44M22.5 10v44M8 32h14.5M37 54V10l9.5 9.5L56 10v44" stroke="url(#lg)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><g fill="#04060b" stroke="url(#lg)" stroke-width="2.6"><circle cx="8" cy="10" r="3.8"/><circle cx="8" cy="54" r="3.8"/><circle cx="22.5" cy="10" r="3.8"/><circle cx="22.5" cy="54" r="3.8"/><circle cx="37" cy="54" r="3.8"/><circle cx="56" cy="54" r="3.8"/></g><g fill="#e2e8f0"><circle cx="8" cy="32" r="2.4"/><circle cx="22.5" cy="32" r="2.4"/><circle cx="46.5" cy="19.5" r="2.4"/></g></svg>`
const brand = (style) => `<div class="layer brand" style="${style}">${LOGO} Housein Monzer</div>`

const page = (w, h, body, { rtl = false, extraCss = '' } = {}) => `<!doctype html>
<html lang="${rtl ? 'ar' : 'en'}" dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">
<link rel="stylesheet" href="../launch/launch.css">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
  .canvas { width: ${w}px; height: ${h}px; }
  .ar, .ar * { font-family: Cairo, 'Segoe UI', sans-serif !important; letter-spacing: 0 !important; }
  .frame { position: absolute; overflow: hidden; border-radius: 28px; border: 1.5px solid #222b45; background: #0e1322; box-shadow: 0 40px 90px -30px rgba(0,0,0,.9), 0 0 80px -30px rgba(34,211,238,.35); }
  .frame img { display: block; width: 100%; height: 100%; object-fit: contain; }
  .price-chip { display: inline-flex; align-items: baseline; gap: 10px; padding: 14px 24px; border-radius: 999px; border: 1.5px solid rgba(34,211,238,.4); background: rgba(34,211,238,.08); color: #e0fbff; font: 600 26px Inter, sans-serif; }
  .price-chip b { font: 700 40px 'Space Grotesk', sans-serif; color: #fff; }
  .bul { display: grid; gap: 18px; font-size: 28px; color: #cbd5e1; }
  .bul div { display: flex; gap: 16px; align-items: flex-start; }
  .bul div::before { content: ''; flex: none; width: 12px; height: 12px; margin-top: 12px; border-radius: 50%; background: linear-gradient(135deg, #22d3ee, #a78bfa); }
  .client { font: 500 20px 'JetBrains Mono', monospace; color: #64748b; }
  ${extraCss}
</style></head><body><div class="canvas${rtl ? ' ar' : ''}">${body}</div></body></html>`

// ── Price lists ────────────────────────────────────────────────────────────────
function priceList(rtl) {
  const rows = pricing.visuals
    .map((p) => {
      const name = rtl ? p.nameAr : p.name
      const unit = rtl ? escAr(p.unitAr) : esc(p.unit)
      const price = rtl ? `<bdi>${p.price}${pricing.currency}</bdi>` : `${pricing.currency}${p.price}`
      return `<div class="row${p.highlight ? ' hl' : ''}">
        <div><b>${esc(name)}</b><span>${unit}</span></div>
        <div class="pr"><small>${rtl ? 'يبدأ من' : 'from'}</small>${price}</div>
      </div>`
    })
    .join('')
  const css = `
    .list { position: absolute; left: 60px; right: 60px; top: 330px; display: grid; gap: 12px; }
    .row { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 13px 28px; border-radius: 20px; border: 1.5px solid #161d31; background: rgba(10,14,25,.85); }
    .row b, .row span { line-height: 1.25; }
    .row.hl { border-color: rgba(34,211,238,.55); background: rgba(34,211,238,.07); box-shadow: 0 0 60px -20px rgba(34,211,238,.6); }
    .row b { display: block; font: 600 29px 'Space Grotesk', sans-serif; color: #f1f5f9; letter-spacing: -.01em; }
    .row span { display: block; margin-top: 2px; font-size: 19px; color: #94a3b8; }
    .pr { flex: none; display: flex; align-items: baseline; gap: 10px; font: 700 44px 'Space Grotesk', sans-serif; color: #fff; }
    .pr small { font: 500 18px Inter, sans-serif; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; }
    .ar .pr small { text-transform: none; font-size: 20px; }
    .ar .list { top: 318px; gap: 9px; }
    .ar .row { padding: 9px 28px; }
    .ar .row b { font-size: 26px; }
    .ar .row span { font-size: 17px; margin-top: 0; }`
  const title = rtl
    ? `<h1 class="layer headline" style="right:60px; top:120px; font-size:74px; line-height:1.15">قائمة الأسعار<br><span class="grad" style="font-size:44px">محتوى بصري بالذكاء الاصطناعي</span></h1>`
    : `<h1 class="layer headline" style="left:56px; top:138px; font-size:84px">Price list<br><span class="grad" style="font-size:52px">AI visual content</span></h1>`
  const foot = rtl
    ? `<p class="layer sub" style="right:60px; left:60px; top:1222px; font-size:21px; color:#94a3b8">${escAr(pricing.noteAr)}</p>
       <p class="layer url" style="right:60px; top:1280px" dir="ltr">${URL_TEXT}</p>
       <p class="layer" style="left:60px; top:1272px; font-size:28px; font-weight:700; color:#22d3ee">للحجز راسلني ←</p>`
    : `<p class="layer sub" style="left:60px; right:60px; top:1222px; font-size:21px; color:#94a3b8">${esc(pricing.note)}</p>
       <p class="layer url" style="left:60px; top:1280px">${URL_TEXT}</p>
       <p class="layer" style="right:60px; top:1272px; font: 600 28px Inter, sans-serif; color:#22d3ee">DM to book →</p>`
  return page(1080, 1350, `${brand(rtl ? 'right:60px; top:60px; direction:ltr' : 'left:60px; top:60px')}${title}<div class="list">${rows}</div>${foot}`, { rtl, extraCss: css })
}

// ── Promo 1: product photography ───────────────────────────────────────────────
const promoProduct = page(1080, 1350, `
  ${brand('left:60px; top:60px')}
  <div class="layer tag" style="right:60px; top:66px">AI Product Photography</div>
  <h1 class="layer headline" style="left:56px; top:160px; font-size:92px">Studio-quality<br><span class="grad">product photos.</span></h1>
  <p class="layer sub" style="left:60px; top:375px; width:900px; font-size:32px">Without the studio. Your product, true to its shape, colors and logo.</p>
  <div class="frame" style="left:60px; top:480px; width:500px; height:625px"><img src="${work('al-montazar/cups-1.webp')}"></div>
  <div class="frame" style="left:590px; top:480px; width:430px; height:296px"><img src="${work('al-montazar/notebooks-1.webp')}" style="object-fit:cover; object-position:50% 45%"></div>
  <div class="frame" style="left:590px; top:808px; width:430px; height:297px"><img src="${work('al-montazar/cups-3.webp')}" style="object-fit:cover; object-position:50% 55%"></div>
  <div class="layer" style="left:60px; top:1150px"><div class="price-chip">from <b>${from('product-photos')}</b> / ${esc(byId('product-photos').unit)}</div></div>
  <p class="layer url" style="right:60px; top:1168px">DM to book · ${URL_TEXT}</p>
  <p class="layer client" style="left:60px; top:1262px">Work shown: Al Montazar Gift</p>
`)

// ── Promo 2: social posts & ads ────────────────────────────────────────────────
const promoAds = page(1080, 1350, `
  ${brand('left:60px; top:60px')}
  <div class="layer tag" style="right:60px; top:66px">Social Posts &amp; Ads</div>
  <h1 class="layer headline" style="left:56px; top:160px; font-size:92px">Ads that stop<br><span class="grad">the scroll.</span></h1>
  <div class="layer bul" style="left:60px; top:420px; width:430px">
    <div>Offers, gift bundles and store openings</div>
    <div>Arabic or English campaigns</div>
    <div>Posts, Stories and Reel covers in every size</div>
    <div>Every product at its real size</div>
  </div>
  <div class="layer" style="left:60px; top:900px"><div class="price-chip">from <b>${from('social-post')}</b> / design</div>
    <p class="sub" style="margin-top:22px; width:440px; font-size:24px; color:#94a3b8">Monthly pack: 12 posts + 8 Stories for ${from('social-monthly')}</p></div>
  <div class="frame" style="left:540px; top:400px; width:480px; height:632px; transform:rotate(3deg)"><img src="${work('al-montazar/gift-bundle-1.webp')}"></div>
  <p class="layer url" style="left:60px; top:1170px">DM to book · ${URL_TEXT}</p>
  <p class="layer client" style="left:60px; top:1262px">Work shown: Al Montazar Gift</p>
`)

// ── Promo 3: e-commerce image sets ─────────────────────────────────────────────
const set = ['notebooks-1', 'notebooks-2', 'notebooks-3', 'notebooks-4', 'notebooks-5']
const promoSets = page(1080, 1350, `
  ${brand('left:60px; top:60px')}
  <div class="layer tag" style="right:60px; top:66px">Shopify &amp; Store Visuals</div>
  <h1 class="layer headline" style="left:56px; top:160px; font-size:92px">One product.<br><span class="grad">One consistent set.</span></h1>
  <p class="layer sub" style="left:60px; top:375px; width:940px; font-size:30px">Matching images for every listing, sized for your store and ready to upload.</p>
  <div class="frame" style="left:60px; top:470px; width:440px; height:550px"><img src="${work(`al-montazar/${set[0]}.webp`)}"></div>
  ${set.slice(1).map((f, i) => `<div class="frame" style="left:${530 + (i % 2) * 250}px; top:${470 + Math.floor(i / 2) * 285}px; width:230px; height:265px; border-radius:22px"><img src="${work(`al-montazar/${f}.webp`)}" style="object-fit:cover"></div>`).join('')}
  <div class="layer" style="left:60px; top:1070px"><div class="price-chip">from <b>${from('shopify-set')}</b> / ${esc(byId('shopify-set').unit)}</div></div>
  <p class="layer url" style="left:60px; top:1180px">DM to book · ${URL_TEXT}</p>
  <p class="layer client" style="left:60px; top:1262px">Work shown: Al Montazar Gift</p>
`)

// ── Story: services overview ───────────────────────────────────────────────────
const storyRows = ['product-photos', 'shopify-set', 'social-post', 'ai-video']
  .map((id) => `<div class="srow"><span>${esc(byId(id).name)}</span><b>from ${from(id)}</b></div>`)
  .join('')
const story = page(1080, 1920, `
  ${brand('left:70px; top:262px')}
  <div class="layer tag" style="right:70px; top:268px">Now booking</div>
  <h1 class="layer headline" style="left:66px; top:380px; font-size:118px">AI visuals<br><span class="grad">for your store.</span></h1>
  <div class="frame" style="left:70px; top:690px; width:300px; height:375px; transform:rotate(-4deg)"><img src="${work('al-montazar/cups-5.webp')}"></div>
  <div class="frame" style="left:390px; top:660px; width:300px; height:395px; z-index:2"><img src="${work('al-montazar/gift-bundle-1.webp')}"></div>
  <div class="frame" style="left:710px; top:690px; width:300px; height:375px; transform:rotate(4deg)"><img src="${work('al-montazar/notebooks-2.webp')}"></div>
  <div class="layer" style="left:70px; right:70px; top:1110px; display:grid; gap:12px">${storyRows}</div>
  <div class="layer" style="left:70px; top:1555px"><div class="cta">Send me your product photo</div><p class="url" style="margin-top:22px">${URL_TEXT}</p></div>
`, { extraCss: `.srow { display:flex; justify-content:space-between; align-items:baseline; padding:16px 30px; border-radius:22px; border:1.5px solid #161d31; background:rgba(10,14,25,.85); font-size:32px; color:#e2e8f0 } .srow b { font: 700 38px 'Space Grotesk', sans-serif; color:#fff }` })

const designs = [
  ['marketing-price-list-en', 1080, 1350, priceList(false)],
  ['marketing-price-list-ar', 1080, 1350, priceList(true)],
  ['marketing-product-photos', 1080, 1350, promoProduct],
  ['marketing-social-ads', 1080, 1350, promoAds],
  ['marketing-shopify-sets', 1080, 1350, promoSets],
  ['marketing-story', 1080, 1920, story],
]

for (const [name, w, h, html] of designs) {
  const file = join(here, `${name}.html`)
  writeFileSync(file, html)
  execFileSync(CHROME, ['--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=${w},${h}`,
    '--virtual-time-budget=8000', `--screenshot=${join(out, `${name}.png`)}`, pathToFileURL(file).href], { stdio: 'ignore' })
  console.log(`${name}.png ${w}x${h}`)
}
