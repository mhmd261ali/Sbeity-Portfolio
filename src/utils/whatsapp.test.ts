import { describe, expect, it } from 'vitest'
import { mapsHref, whatsappHref } from '@/utils/whatsapp'

describe('contact links', () => {
  it('builds a WhatsApp link from a formatted phone', () => {
    expect(whatsappHref('+961 70 000 000', 'مرحباً')).toBe('https://wa.me/96170000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B')
  })

  it('prefers an explicit map url', () => {
    expect(mapsHref('بيروت', 'https://maps.example/pin')).toBe('https://maps.example/pin')
    expect(mapsHref('بيروت')).toContain('query=')
    expect(mapsHref('  ')).toBeNull()
  })
})
