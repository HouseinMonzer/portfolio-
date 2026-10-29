import type { ServiceId } from '../../shared/services'
import { scrollToId } from './scroll'

const EVENT = 'hm:discuss'

type Detail = { service: ServiceId | ''; note: string }

/**
 * Scrolls to the contact form with `service` preselected (or leaves the choice to the visitor).
 * `note` (e.g. a pricing package) pre-fills the subject when the visitor hasn't typed one.
 */
export function discussProject(service?: ServiceId, note = '') {
  window.dispatchEvent(new CustomEvent<Detail>(EVENT, { detail: { service: service ?? '', note } }))
  scrollToId('contact')
}

/** Lets the contact form react to discussProject(). Returns an unsubscribe function. */
export function onDiscussProject(cb: (detail: Detail) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<Detail>).detail)
  window.addEventListener(EVENT, handler)
  return () => window.removeEventListener(EVENT, handler)
}
