// AI visual portfolio. Edit this file to add or publish work.
//
// To add a project:
//   1. Convert its files: node scripts/webp.mjs public/work/<slug> <your images...>
//      (it prints each image's width × height).
//   2. Add an entry below with those paths and sizes, an honest `deliverable`, and status 'published'.
//
// Rules the site relies on:
//   - Only 'published' projects with at least one media file are shown.
//   - A filter button appears only when at least one published project is in that category.
//   - 'Completed Video' is only for real video files. Storyboards, concepts and prompts use their own labels.

export type VisualCategory = 'product' | 'ads' | 'video' | 'branding'

export const categoryLabels: Record<VisualCategory, string> = {
  product: 'Product Photography',
  ads: 'Posts & Ads',
  video: 'Video & Storyboards',
  branding: 'Branding & Print',
}

export type Deliverable =
  | 'Product Images'
  | 'Shopify Image Set'
  | 'Advertising Visuals'
  | 'Social Media Campaign'
  | 'Storyboard'
  | 'Video Concept'
  | 'Completed Video'
  | 'Brand Identity'
  | 'Print Design'

export type VisualMedia =
  | { kind: 'image'; src: string; width: number; height: number; alt: string }
  | { kind: 'video'; src: string; poster: string; width: number; height: number; alt: string }

export type VisualProject = {
  id: string
  title: string
  /** Only for work done for someone else, with their permission to show it. */
  client?: { name: string; url?: string }
  category: VisualCategory
  deliverable: Deliverable
  description: string
  media: VisualMedia[]
  status: 'published' | 'draft'
  /** For drafts: what is still needed before it can be published. Not shown on the site. */
  needs?: string
}

export const visualProjects: VisualProject[] = [
  // ── Published ────────────────────────────────────────────────────────────────
  // Al Montazar Gift: client work, shown with the store's permission. Images taken from its public posts.
  {
    id: 'al-montazar-gift-bundle',
    title: 'Men’s gift bundle offer',
    client: { name: 'Al Montazar Gift', url: 'https://www.instagram.com/al.montazar_lb1/' },
    category: 'ads',
    deliverable: 'Advertising Visuals',
    description:
      'Promotional post for a Lebanese gift store: a men’s bundle of watch, wallet, fragrance, deodorant and cap arranged on a gold-and-marble set, every item kept at its real relative size, with the store logo, the offer price and Arabic labels.',
    status: 'published',
    media: [
      { kind: 'image', src: '/work/al-montazar/gift-bundle-1.webp', width: 1080, height: 1423, alt: 'Arabic “special offer” ad for Al Montazar Gift: a silver watch in a green box, a black leather wallet, a fragrance, a Speed Stick deodorant and a black cap on a gold and marble display, with the price reduced from 31 to 27 dollars' },
    ],
  },
  {
    id: 'al-montazar-cups',
    title: 'Ceramic cup collection',
    client: { name: 'Al Montazar Gift', url: 'https://www.instagram.com/al.montazar_lb1/' },
    category: 'product',
    deliverable: 'Product Images',
    description:
      'Lifestyle images for six decorated cup-and-saucer sets, all staged in the same warm, soft-lit scene so the collection reads as one set while each pattern stays exact.',
    status: 'published',
    media: [
      { kind: 'image', src: '/work/al-montazar/cups-1.webp', width: 1080, height: 1350, alt: 'White ceramic cup and saucer covered in small red bows, on a marble table with white flowers and a lamp' },
      { kind: 'image', src: '/work/al-montazar/cups-2.webp', width: 1080, height: 1350, alt: 'White cup and saucer with small multicolored hearts in a bright, flower-filled scene' },
      { kind: 'image', src: '/work/al-montazar/cups-3.webp', width: 1080, height: 1350, alt: 'Cup and saucer with wavy yellow, black and red stripes, smiley faces and the words smile today' },
      { kind: 'image', src: '/work/al-montazar/cups-4.webp', width: 1080, height: 1350, alt: 'White cup and saucer decorated with colorful little flowers and leaves' },
      { kind: 'image', src: '/work/al-montazar/cups-5.webp', width: 1080, height: 1350, alt: 'White cup and saucer with small red flowers, next to baby’s breath and a candle' },
      { kind: 'image', src: '/work/al-montazar/cups-6.webp', width: 1080, height: 1350, alt: 'White cup and saucer patterned with red roses in a soft-lit scene with pink flowers' },
    ],
  },
  {
    id: 'al-montazar-notebooks',
    title: 'Fabric-cover notebooks',
    client: { name: 'Al Montazar Gift', url: 'https://www.instagram.com/al.montazar_lb1/' },
    category: 'product',
    deliverable: 'Product Images',
    description:
      'A group shot and one clean image per design for spiral notebooks with floral fabric covers, keeping each print, the stitching and the spiral binding true to the product.',
    status: 'published',
    media: [
      { kind: 'image', src: '/work/al-montazar/notebooks-1.webp', width: 1080, height: 1350, alt: 'Four spiral notebooks with rose-print fabric covers in black, turquoise, cream and navy, standing on a beige set' },
      { kind: 'image', src: '/work/al-montazar/notebooks-2.webp', width: 1080, height: 1350, alt: 'Spiral notebook with a turquoise fabric cover printed with red roses' },
      { kind: 'image', src: '/work/al-montazar/notebooks-3.webp', width: 1080, height: 1350, alt: 'Spiral notebook with a black fabric cover printed with red roses' },
      { kind: 'image', src: '/work/al-montazar/notebooks-4.webp', width: 1080, height: 1350, alt: 'Spiral notebook with a dark fabric cover printed with pink roses' },
      { kind: 'image', src: '/work/al-montazar/notebooks-5.webp', width: 1080, height: 1350, alt: 'Spiral notebook with a cream fabric cover printed with red roses' },
    ],
  },
  {
    id: 'hm-brand-identity',
    title: 'HM Circuit Monogram',
    category: 'branding',
    deliverable: 'Brand Identity',
    description:
      'Visual identity for my own studio: five logo directions explored with AI-assisted design, then a circuit-style HM monogram rolled out as the favicon, app icons and social profile images.',
    status: 'published',
    media: [
      { kind: 'image', src: '/work/hm-brand/05-circuit-monogram.webp', width: 1080, height: 1080, alt: 'Final HM logo: the letters H and M drawn as glowing cyan-to-violet circuit traces with round nodes, on a dark background' },
      { kind: 'image', src: '/work/hm-brand/01-monogram-seal.webp', width: 1080, height: 1080, alt: 'Logo direction 1: gradient HM monogram inside a ring with the text Housein Monzer, Full-Stack Developer' },
      { kind: 'image', src: '/work/hm-brand/02-gradient-orb.webp', width: 1080, height: 1080, alt: 'Logo direction 2: glowing cyan and violet orb with the letter H and a dot cut out of it' },
      { kind: 'image', src: '/work/hm-brand/03-minimal-wordmark.webp', width: 1080, height: 1080, alt: 'Logo direction 3: lowercase hm wordmark with a cyan dot on a light background' },
      { kind: 'image', src: '/work/hm-brand/04-isometric-cube.webp', width: 1080, height: 1080, alt: 'Logo direction 4: isometric 3D cube with H and M on its faces' },
    ],
  },
  {
    id: 'portfolio-relaunch',
    title: 'Portfolio relaunch campaign',
    category: 'ads',
    deliverable: 'Social Media Campaign',
    description:
      'Launch announcement for this website: a 4:5 LinkedIn post, a 9:16 Story and matching cover banners for LinkedIn, X and Facebook, built around real screenshots and the new brand.',
    status: 'published',
    media: [
      { kind: 'image', src: '/work/relaunch-campaign/launch-linkedin.webp', width: 1080, height: 1350, alt: 'LinkedIn post reading “New design. New style.” above screenshots of the redesigned portfolio on a laptop browser and a phone' },
      { kind: 'image', src: '/work/relaunch-campaign/launch-story.webp', width: 1080, height: 1920, alt: 'Vertical Story reading “New design. New style.” with three feature highlights, a See it live button and a tilted phone showing the site' },
      { kind: 'image', src: '/work/relaunch-campaign/banner-linkedin.webp', width: 1584, height: 396, alt: 'LinkedIn cover banner with the name Housein Monzer, Full-Stack Developer, circuit lines and the HM monogram' },
      { kind: 'image', src: '/work/relaunch-campaign/banner-x.webp', width: 1500, height: 500, alt: 'X header banner with the name, role, key skills and the HM monogram' },
      { kind: 'image', src: '/work/relaunch-campaign/banner-facebook.webp', width: 1600, height: 609, alt: 'Facebook cover with a centered HM monogram, name, role and skills' },
    ],
  },

  // ── Drafts: hidden until their files are added ───────────────────────────────
  {
    id: 'luxury-watch',
    title: 'Luxury watch imagery',
    category: 'product',
    deliverable: 'Product Images',
    description: 'Black-and-gold studio environments for a luxury watch, shown from multiple angles with the dial, case and strap details kept true to the original.',
    status: 'draft',
    media: [],
    needs: 'The final watch images (3–6, each angle), plus the original product photo if you want a before/after.',
  },
  {
    id: 'vibration-plate-ads',
    title: 'Vibration plate ad visuals',
    category: 'ads',
    deliverable: 'Advertising Visuals',
    description: 'Advertising visuals for a vibration plate fitness machine.',
    status: 'draft',
    media: [],
    needs: 'The final ad images, in the sizes you delivered (for example 1080×1350, 1:1 or 9:16).',
  },
  {
    id: 'tv-trolley-storyboards',
    title: 'TV trolley showcase storyboards',
    category: 'video',
    deliverable: 'Storyboard',
    description: 'Product showcase storyboards for several TV trolley models: scene order, camera movement and transitions.',
    status: 'draft',
    media: [],
    needs: 'Storyboard frames or pages exported as images (one per scene or per model). If any were produced as videos, the MP4s plus a poster image for each.',
  },
  {
    id: 'flip-jar-concept',
    title: 'Flip jar video concept',
    category: 'video',
    deliverable: 'Video Concept',
    description: 'Video concept and scene sequence for a glass jar that flips to separate liquid from food.',
    status: 'draft',
    media: [],
    needs: 'Concept frames or a storyboard image. Mark it as Completed Video only if you have the final MP4 (then add the file and a poster).',
  },
  {
    id: 'al-montazar-reels',
    title: 'Al Montazar Gift reels',
    client: { name: 'Al Montazar Gift', url: 'https://www.instagram.com/al.montazar_lb1/' },
    category: 'video',
    deliverable: 'Completed Video',
    description: 'Short product Reels for the store’s cosmetics, fragrance and gift posts.',
    status: 'draft',
    media: [],
    needs: 'The original MP4 of each Reel (not the Instagram cover) plus a poster image; mark any that are only concepts as Video Concept instead.',
  },
  {
    id: 'shopify-image-sets',
    title: 'Shopify image sets',
    category: 'product',
    deliverable: 'Shopify Image Set',
    description: 'Consistent five-image listing sets for products, cosmetics and home accessories.',
    status: 'draft',
    media: [],
    needs: 'One or two complete five-image sets (angles, features, details, lifestyle) for a product or two.',
  },
  {
    id: 'bags-perfume-candles',
    title: 'Handbags, perfumes & candles',
    category: 'product',
    deliverable: 'Product Images',
    description: 'Product visuals for handbags, perfumes, candles and accessories in studio and lifestyle scenes.',
    status: 'draft',
    media: [],
    needs: 'Your best 4–8 final images across these products.',
  },
  {
    id: 'gift-store-identity',
    title: 'Gift store identity',
    category: 'branding',
    deliverable: 'Brand Identity',
    description: 'Logo and visual identity for a gift store, with coordinated colors and packaging assets.',
    status: 'draft',
    media: [],
    needs: 'If this is Al Montazar Gift: the original logo file (PNG or SVG). Instagram only offers a 100×100 profile picture, too small to show.',
  },
  {
    id: 'a5-notebooks-print',
    title: 'Personalized notebooks & print',
    category: 'branding',
    deliverable: 'Print Design',
    description: 'Personalized A5 notebook covers, bookmarks and other print materials laid out for their final print size.',
    status: 'draft',
    media: [],
    needs: 'Flat exports or photos of the printed notebooks and bookmarks, without customers’ private names unless they agreed.',
  },
]

export const publishedVisuals = visualProjects.filter((p) => p.status === 'published' && p.media.length > 0)
