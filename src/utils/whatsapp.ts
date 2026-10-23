export function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export function whatsappHref(phone: string, message: string) {
  const digits = digitsOnly(phone)
  if (!digits) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function mapsHref(address?: string, explicitUrl?: string) {
  if (explicitUrl) return explicitUrl
  const trimmed = address?.trim()
  if (!trimmed) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`
}

export function telHref(phone?: string) {
  const digits = phone ? digitsOnly(phone) : ''
  if (!digits) return null
  return `tel:+${digits}`
}
