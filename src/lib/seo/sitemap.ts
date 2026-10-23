export type SitemapUrl = {
  loc: string
  lastmod?: string
  image?: string
}

export function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function toDateStamp(iso?: string) {
  if (!iso) return undefined
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString().slice(0, 10)
}

export function buildSitemapXml(urls: SitemapUrl[]) {
  const body = urls
    .map((url) => {
      const lastmod = url.lastmod ? `\n    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : ''
      const image = url.image
        ? `\n    <image:image><image:loc>${escapeXml(url.image)}</image:loc></image:image>`
        : ''
      return `  <url>\n    <loc>${escapeXml(url.loc)}</loc>${lastmod}${image}\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${body}\n</urlset>\n`
}

export function applySeoToHtml(
  template: string,
  seo: { title: string; description: string; url: string; image: string },
) {
  const title = escapeXml(seo.title)
  const description = escapeXml(seo.description)
  const url = escapeXml(seo.url)
  const image = escapeXml(seo.image)

  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
  html = replaceMeta(html, 'name', 'description', description)
  html = replaceMeta(html, 'property', 'og:title', title)
  html = replaceMeta(html, 'property', 'og:description', description)
  html = replaceMeta(html, 'property', 'og:url', url)
  html = replaceMeta(html, 'property', 'og:image', image)
  html = replaceMeta(html, 'name', 'twitter:title', title)
  html = replaceMeta(html, 'name', 'twitter:description', description)
  html = replaceMeta(html, 'name', 'twitter:image', image)
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
  return html
}

function replaceMeta(html: string, attr: 'name' | 'property', key: string, content: string) {
  const pattern = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`, 'i')
  if (pattern.test(html)) return html.replace(pattern, `$1${content}$2`)
  return html.replace('</head>', `    <meta ${attr}="${key}" content="${content}" />\n  </head>`)
}
