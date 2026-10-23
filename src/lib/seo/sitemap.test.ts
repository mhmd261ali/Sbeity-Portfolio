import { describe, expect, it } from 'vitest'
import { applySeoToHtml, buildSitemapXml, escapeXml } from '@/lib/seo/sitemap'

describe('sitemap and route html', () => {
  it('escapes xml', () => {
    expect(escapeXml(`a&b<c>"'`)).toBe('a&amp;b&lt;c&gt;&quot;&apos;')
  })

  it('builds a sitemap with images', () => {
    const xml = buildSitemapXml([{ loc: 'https://sbeity.example/products/wood', lastmod: '2026-01-02', image: 'https://cdn.example/a.jpg' }])
    expect(xml).toContain('<loc>https://sbeity.example/products/wood</loc>')
    expect(xml).toContain('<image:loc>https://cdn.example/a.jpg</image:loc>')
  })

  it('replaces the title and description in a shell', () => {
    const html = applySeoToHtml('<html><head><title>قديم</title><meta name="description" content="قديم" /></head><body></body></html>', {
      title: 'لوحة & اسم',
      description: 'وصف',
      url: 'https://sbeity.example/products/a',
      image: 'https://cdn.example/a.jpg',
    })
    expect(html).toContain('<title>لوحة &amp; اسم</title>')
    expect(html).toContain('content="وصف"')
  })
})
