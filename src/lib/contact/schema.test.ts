import { describe, expect, it } from 'vitest'
import { looksLikeSpam, validateContact } from '@/lib/contact/schema'

const valid = {
  name: 'ليلى حسن',
  email: 'layla@example.com',
  phone: '70123456',
  service: '',
  subject: 'طلب عرض سعر',
  productTitle: '',
  productSlug: '',
  message: 'أريد لوحة اسم خشبية للمكتب.',
  companyWebsite: '',
}

describe('contact schema', () => {
  it('accepts a complete inquiry', () => {
    const result = validateContact(valid)
    expect(result.ok).toBe(true)
  })

  it('accepts an inquiry without a message or service', () => {
    const result = validateContact({ ...valid, message: '', service: '' })
    expect(result.ok).toBe(true)
  })

  it('requires a phone number', () => {
    const result = validateContact({ ...valid, phone: '' })
    expect(result.ok).toBe(false)
  })

  it('treats the honeypot as spam', () => {
    expect(looksLikeSpam({ companyWebsite: 'https://spam.test', message: valid.message })).toBe(true)
    expect(looksLikeSpam({ companyWebsite: '', message: valid.message })).toBe(false)
  })
})
