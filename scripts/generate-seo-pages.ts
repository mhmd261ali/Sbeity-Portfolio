import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { createClient } from '@sanity/client'
import { applySeoToHtml, buildSitemapXml, toDateStamp, type SitemapUrl } from '../src/lib/seo/sitemap'
import { sitemapQuery } from '../src/lib/sanity/queries'
import { loadEnvFiles } from './loadEnv'

loadEnvFiles()

const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/$/, '')
const dist = path.resolve('dist')
const templatePath = path.join(dist, 'index.html')

if (!existsSync(templatePath)) {
  console.warn('dist/index.html غير موجود، تم تخطي صفحات السيو.')
  process.exit(0)
}

const template = readFileSync(templatePath, 'utf8')
const fallbackImage = `${siteUrl}/brand/logo.png`
const description = 'استوديو سبيتي للطباعة والتصميم حسب الطلب. لوحات كانفس، لافتات، أخشاب، ومطبوعات تُصنع بعناية.'

type Entry = { path: string; title: string; description: string; image?: string; lastmod?: string }

const entries: Entry[] = [
  { path: '/', title: 'سبيتي | الطباعة الإبداعية والتصميم حسب الطلب', description },
  { path: '/products', title: 'المنتجات | سبيتي', description: 'تصفحوا منتجات الطباعة والتصميم حسب الطلب.' },
  { path: '/our-work', title: 'أعمالنا | سبيتي', description: 'مشاريع منفذة في الطباعة واللافتات والأخشاب.' },
  { path: '/about', title: 'من نحن | سبيتي', description: 'قصة الاستوديو، الخامات، وطريقة العمل.' },
  { path: '/contact', title: 'تواصل معنا | سبيتي', description: 'اطلبوا عرض سعر أو اسألوا عن قطعة.' },
]

type SitemapDoc = { title?: string; slug?: string; _updatedAt?: string; image?: string }
type SitemapData = { products?: SitemapDoc[]; projects?: SitemapDoc[] }

async function loadContent() {
  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
  const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'
  if (!projectId) return
  const client = createClient({ projectId, dataset, apiVersion: '2026-10-22', useCdn: true, perspective: 'published' })
  const data = await client.fetch<SitemapData>(sitemapQuery)
  for (const product of data.products ?? []) {
    if (!product.slug) continue
    entries.push({
      path: `/products/${product.slug}`,
      title: `${product.title || product.slug} | سبيتي`,
      description,
      image: product.image,
      lastmod: toDateStamp(product._updatedAt),
    })
  }
  for (const project of data.projects ?? []) {
    if (!project.slug) continue
    entries.push({
      path: `/our-work/${project.slug}`,
      title: `${project.title || project.slug} | سبيتي`,
      description,
      image: project.image,
      lastmod: toDateStamp(project._updatedAt),
    })
  }
}

function writeEntry(entry: Entry) {
  const url = entry.path === '/' ? `${siteUrl}/` : `${siteUrl}${entry.path}`
  const html = applySeoToHtml(template, {
    title: entry.title,
    description: entry.description,
    url,
    image: entry.image || fallbackImage,
  })
  const folder = entry.path === '/' ? dist : path.join(dist, entry.path)
  mkdirSync(folder, { recursive: true })
  writeFileSync(path.join(folder, 'index.html'), html)
}

async function main() {
  try {
    await loadContent()
  } catch (error) {
    console.warn('تعذر جلب مسارات Sanity أثناء بناء خريطة الموقع.', error instanceof Error ? error.message : error)
  }

  for (const entry of entries) writeEntry(entry)

  const urls: SitemapUrl[] = entries.map((entry) => ({
    loc: entry.path === '/' ? `${siteUrl}/` : `${siteUrl}${entry.path}`,
    lastmod: entry.lastmod,
    image: entry.image,
  }))
  writeFileSync(path.join(dist, 'sitemap.xml'), buildSitemapXml(urls))
  writeFileSync(
    path.join(dist, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /studio\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
  )
  console.log(`كُتبت ${entries.length} صفحة سيو وخريطة موقع.`)
}

void main()
