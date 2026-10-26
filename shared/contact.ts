import { z } from 'zod'
import { SERVICE_IDS } from './services.js'

// Single source of truth for the contact form — used by the React form for
// instant field errors AND by /api/contact so the server never trusts the client.
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80, 'Name is too long'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email').max(160),
  // Optional: general enquiries can leave it empty.
  service: z.union([z.enum(SERVICE_IDS), z.literal('')], { error: 'Please pick a service from the list' }).optional().default(''),
  subject: z.string().trim().max(120).optional().default(''),
  message: z
    .string()
    .trim()
    .min(10, 'Message should be at least 10 characters')
    .max(4000, 'Message is too long (4000 max)'),
  // Honeypot: real users never see or fill this field.
  website: z.string().max(0).optional().default(''),
})

export type ContactData = z.output<typeof contactSchema>

export type FieldErrors = Partial<Record<'name' | 'email' | 'service' | 'subject' | 'message', string>>

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {}
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof FieldErrors
    if (key && !out[key]) out[key] = issue.message
  }
  return out
}

export type ContactResponse =
  | { ok: true; id?: number }
  | { ok: false; error: string; fields?: FieldErrors; fallback?: boolean }
