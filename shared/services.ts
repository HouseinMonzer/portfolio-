// Services a visitor can ask for. Single source for the contact form's select, the API's
// validation and the notification emails. Card copy for the Services section lives in src/data/services.ts.
export const SERVICE_OPTIONS = [
  { id: 'web-app', label: 'Website or web app', group: 'Web development' },
  { id: 'business-site', label: 'Business or WordPress website', group: 'Web development' },
  { id: 'product-photography', label: 'AI product photography', group: 'AI visuals' },
  { id: 'ecommerce-visuals', label: 'E-commerce & Shopify visuals', group: 'AI visuals' },
  { id: 'social-ads', label: 'Social media posts & ads', group: 'AI visuals' },
  { id: 'video-reels', label: 'AI video & reels', group: 'AI visuals' },
  { id: 'branding', label: 'Branding & campaign visuals', group: 'AI visuals' },
  { id: 'enhancement-print', label: 'Photo enhancement & print design', group: 'AI visuals' },
  { id: 'other', label: 'Something else', group: 'Other' },
] as const

export type ServiceId = (typeof SERVICE_OPTIONS)[number]['id']

export const SERVICE_IDS = SERVICE_OPTIONS.map((s) => s.id) as [ServiceId, ...ServiceId[]]

export const serviceLabel = (id?: string) => SERVICE_OPTIONS.find((s) => s.id === id)?.label ?? ''
