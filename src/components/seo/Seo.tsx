import { useEffect } from 'react'

type JsonLd = Record<string, unknown>

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export function siteOrigin() {
  const configured = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')
  if (configured) return configured
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export function Seo({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  jsonLd,
}: {
  title: string
  description: string
  path?: string
  image?: string
  type?: string
  jsonLd?: JsonLd
}) {
  const serializedLd = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    const origin = siteOrigin()
    const url = `${origin}${path === '/' ? '/' : path}`
    const card = image || `${origin}/brand/logo.png`
    document.title = title
    document.documentElement.lang = 'ar'
    document.documentElement.dir = 'rtl'
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', card)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:locale', 'ar_AR')
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', card)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

    const scriptId = 'seo-ld'
    const existing = document.getElementById(scriptId)
    if (!serializedLd) {
      existing?.remove()
      return
    }
    const script = existing ?? document.createElement('script')
    script.id = scriptId
    script.setAttribute('type', 'application/ld+json')
    script.textContent = serializedLd
    if (!existing) document.head.appendChild(script)
  }, [title, description, path, image, type, serializedLd])

  return null
}
