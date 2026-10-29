// Typed access to pricing.json. Edit prices in the JSON: it also feeds the social price-list
// images (brand/social/marketing/build-marketing.mjs), so the site and the images always match.
import raw from './pricing.json'
import { SERVICE_IDS, type ServiceId } from '../../shared/services'

export type Package = {
  id: string
  service: ServiceId
  name: string
  price: number
  unit: string
  includes: string[]
  highlight?: boolean
}

// Drop any package whose service id isn't a real service, so a typo can't break the contact form.
const valid = (list: (Omit<Package, 'service'> & { service: string })[]) =>
  list.filter((p): p is Package => (SERVICE_IDS as string[]).includes(p.service))

export const currency = raw.currency
export const pricingNote = raw.note
export const visualPackages = valid(raw.visuals)
export const webPackages = valid(raw.web)
