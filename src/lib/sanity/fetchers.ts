import { preview } from '@/content/preview'
import { isSanityConfigured, sanityFetch } from '@/lib/sanity/client'
import {
  aboutQuery,
  categoriesQuery,
  homepageQuery,
  productBySlugQuery,
  productTitleQuery,
  productsQuery,
  projectBySlugQuery,
  projectsQuery,
  servicesQuery,
  siteSettingsQuery,
  testimonialsQuery,
} from '@/lib/sanity/queries'
import type {
  AboutPage,
  Category,
  Homepage,
  ProductCard,
  ProductDetail,
  ProjectCard,
  ProjectDetail,
  Service,
  SiteSettings,
  Testimonial,
} from '@/types/content'

function list<T>(value: T[] | null | undefined) {
  return value?.filter(Boolean) ?? []
}

export async function getSiteSettings() {
  if (!isSanityConfigured()) return { configured: false as const, settings: null }
  const settings = await sanityFetch<SiteSettings | null>(siteSettingsQuery)
  return { configured: true as const, settings }
}

export async function getHomepage() {
  if (!isSanityConfigured()) return { configured: false as const, page: preview.homepage }
  const page = await sanityFetch<Homepage | null>(homepageQuery)
  return { configured: true as const, page }
}

export async function getAboutPage() {
  if (!isSanityConfigured()) return { configured: false as const, page: preview.about }
  const page = await sanityFetch<AboutPage | null>(aboutQuery)
  return { configured: true as const, page }
}

export async function getCategories() {
  if (!isSanityConfigured()) return { configured: false as const, categories: preview.categories }
  const categories = await sanityFetch<Category[] | null>(categoriesQuery)
  return { configured: true as const, categories: list(categories) }
}

export async function getServices() {
  if (!isSanityConfigured()) return { configured: false as const, services: preview.services }
  const services = await sanityFetch<Service[] | null>(servicesQuery)
  return { configured: true as const, services: list(services) }
}

export async function getTestimonials() {
  if (!isSanityConfigured()) return { configured: false as const, testimonials: preview.testimonials }
  const testimonials = await sanityFetch<Testimonial[] | null>(testimonialsQuery)
  return { configured: true as const, testimonials: list(testimonials) }
}

export async function getProducts() {
  if (!isSanityConfigured()) return { configured: false as const, products: preview.products }
  const products = await sanityFetch<ProductCard[] | null>(productsQuery)
  return { configured: true as const, products: list(products).filter((item) => item.slug) }
}

export async function getProjects() {
  if (!isSanityConfigured()) return { configured: false as const, projects: preview.projects }
  const projects = await sanityFetch<ProjectCard[] | null>(projectsQuery)
  return { configured: true as const, projects: list(projects).filter((item) => item.slug) }
}

export async function getProduct(slug: string) {
  if (!isSanityConfigured()) return { configured: false as const, product: preview.product(slug) }
  const product = await sanityFetch<ProductDetail | null>(productBySlugQuery, { slug })
  return { configured: true as const, product: product?.slug ? product : null }
}

export async function getProject(slug: string) {
  if (!isSanityConfigured()) return { configured: false as const, project: preview.project(slug) }
  const project = await sanityFetch<ProjectDetail | null>(projectBySlugQuery, { slug })
  return { configured: true as const, project: project?.slug ? project : null }
}

export async function getProductTitle(slug: string) {
  if (!slug) return null
  if (!isSanityConfigured()) {
    const product = preview.product(slug)
    return product ? { title: product.title, slug: product.slug } : null
  }
  return sanityFetch<{ title?: string; slug?: string } | null>(productTitleQuery, { slug })
}

export function pickFeaturedProducts(page: Homepage | null, products: ProductCard[]) {
  const selected = list(page?.featuredProducts).filter((item) => item?.slug)
  if (selected.length) return selected
  const featured = products.filter((item) => item.featured)
  return (featured.length ? featured : products).slice(0, 6)
}

export function pickFeaturedProjects(page: Homepage | null, projects: ProjectCard[]) {
  const selected = list(page?.featuredProjects).filter((item) => item?.slug)
  if (selected.length) return selected
  const featured = projects.filter((item) => item.featured)
  return (featured.length ? featured : projects).slice(0, 4)
}
