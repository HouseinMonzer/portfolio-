import type { ServiceId } from '../../shared/services'

export type ServiceIcon = 'code' | 'globe' | 'camera' | 'bag' | 'megaphone' | 'clapper' | 'palette' | 'printer'

export type Service = {
  id: ServiceId
  title: string
  summary: string
  points: string[]
  icon: ServiceIcon
  /** Typical output sizes, shown as chips. */
  formats?: string[]
}

export const webServices: Service[] = [
  {
    id: 'web-app',
    title: 'Websites & web apps',
    summary: 'Full-stack products built with React, TypeScript, Node.js and PostgreSQL: marketplaces, dashboards, APIs and authentication.',
    points: ['From requirements and UI/UX to deployment', 'Fast, accessible and SEO-ready by default'],
    icon: 'code',
  },
  {
    id: 'business-site',
    title: 'Business & WordPress websites',
    summary: 'Marketing sites for brands and local businesses, including multilingual EN / AR / FR sites with right-to-left support.',
    points: ['Theme customization, plugins and on-page SEO', 'Ongoing maintenance and load-time optimization'],
    icon: 'globe',
  },
]

export const visualServices: Service[] = [
  {
    id: 'product-photography',
    title: 'AI product photography',
    summary: 'Ordinary product photos turned into studio-grade visuals: clean white backgrounds, studio sets, premium scenes and realistic lifestyle shots.',
    points: [
      'Watches, handbags, perfumes, accessories, cosmetics, gifts and home products',
      'Shape, colors, proportions, packaging, logos and labels kept faithful to the product',
      'Every result checked against your original reference photos',
    ],
    icon: 'camera',
  },
  {
    id: 'ecommerce-visuals',
    title: 'E-commerce & Shopify visuals',
    summary: 'Consistent image sets that make every product listing in your store look like one brand.',
    points: [
      'Typical set of five: two product angles, a features or benefits image, a details or package-contents image, and a lifestyle shot',
      'Sized for your store and exported as optimized WebP when needed',
    ],
    icon: 'bag',
  },
  {
    id: 'social-ads',
    title: 'Social media posts & ads',
    summary: 'Instagram posts, Stories, Reel covers, promotional offers, gift-bundle ads, store openings and brand introductions.',
    points: ['Arabic and English campaigns on request', 'Consistent branding with clear product presentation'],
    icon: 'megaphone',
    formats: ['1080×1350', '1:1', '9:16'],
  },
  {
    id: 'video-reels',
    title: 'AI video & reels',
    summary: 'Short ad concepts, product animations, showcase scenes and usage demonstrations.',
    points: [
      'Scripts, creative concepts and voiceover scripts',
      'Scene breakdowns, storyboards, camera moves and transitions',
      'Detailed video-generation prompts, including structured JSON prompts',
    ],
    icon: 'clapper',
  },
  {
    id: 'branding',
    title: 'Branding & campaign visuals',
    summary: 'Logos, visual directions, color palettes and coordinated assets for campaigns, store pages and gift packaging.',
    points: ['One visual system across every touchpoint', 'Delivered as ready-to-use files for web, social and print'],
    icon: 'palette',
  },
  {
    id: 'enhancement-print',
    title: 'Photo enhancement & print design',
    summary: 'Natural retouching of lighting, color, clarity and backgrounds, plus notebooks, bookmarks, invitations, posters and signage.',
    points: ['Identity and important details preserved', 'Layouts prepared at the exact print dimensions'],
    icon: 'printer',
  },
]
