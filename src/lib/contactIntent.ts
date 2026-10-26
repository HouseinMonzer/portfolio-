import type { ServiceId } from '../../shared/services'
import { scrollToId } from './scroll'

const EVENT = 'hm:discuss'

/** Scrolls to the contact form with `service` preselected (or leaves the choice to the visitor). */
export function discussProject(service?: ServiceId) {
  window.dispatchEvent(new CustomEvent<ServiceId | ''>(EVENT, { detail: service ?? '' }))
  scrollToId('contact')
}

/** Lets the contact form react to discussProject(). Returns an unsubscribe function. */
export function onDiscussProject(cb: (service: ServiceId | '') => void) {
  const handler = (e: Event) => cb((e as CustomEvent<ServiceId | ''>).detail)
  window.addEventListener(EVENT, handler)
  return () => window.removeEventListener(EVENT, handler)
}
