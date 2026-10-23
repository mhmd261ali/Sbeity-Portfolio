import type { PortableTextBlock } from '@portabletext/types'

export type SanityImage = {
  alt?: string
  /** Local preview path used only before a Sanity asset exists. */
  src?: string
  crop?: { top: number; bottom: number; left: number; right: number }
  hotspot?: { x: number; y: number; height: number; width: number }
  asset?: {
    _id?: string
    metadata?: {
      lqip?: string
      dimensions?: { width?: number; height?: number; aspectRatio?: number }
    }
  }
} | null

export type CategoryRef = {
  title?: string
  slug?: string
} | null

export type ProductCard = {
  _id: string
  title: string
  slug: string
  shortDescription?: string
  featured?: boolean
  displayOrder?: number
  _createdAt?: string
  _updatedAt?: string
  category?: CategoryRef
  mainImage?: SanityImage
}

export type ProductDetail = ProductCard & {
  description?: PortableTextBlock[]
  gallery?: SanityImage[]
  materials?: string[]
  sizes?: string[]
  customizationOptions?: string[]
  related?: ProductCard[]
}

export type ProjectCard = {
  _id: string
  title: string
  slug: string
  summary?: string
  client?: string
  year?: number
  featured?: boolean
  _createdAt?: string
  _updatedAt?: string
  category?: CategoryRef
  coverImage?: SanityImage
}

export type ProjectDetail = ProjectCard & {
  description?: PortableTextBlock[]
  images?: SanityImage[]
  beforeImage?: SanityImage
  afterImage?: SanityImage
  services?: string[]
  materials?: string[]
  related?: ProjectCard[]
}

export type Category = {
  _id: string
  title: string
  slug: string
  description?: string
  displayOrder?: number
  image?: SanityImage
}

export type Service = {
  _id: string
  title: string
  slug: string
  description?: string
  icon?: string
  displayOrder?: number
  image?: SanityImage
  category?: CategoryRef
}

export type Testimonial = {
  _id: string
  customerName: string
  role?: string
  content: string
  rating?: number
  featured?: boolean
}

export type SocialLink = {
  _key?: string
  platform?: string
  url?: string
}

export type TextItem = {
  _key?: string
  title?: string
  description?: string
}

export type SiteSettings = {
  companyName?: string
  tagline?: string
  description?: string
  email?: string
  phone?: string
  whatsapp?: string
  address?: string
  googleMapsUrl?: string
  socialLinks?: SocialLink[]
  seoTitle?: string
  seoDescription?: string
  logo?: SanityImage
  favicon?: SanityImage
  ogImage?: SanityImage
}

export type Homepage = {
  eyebrow?: string
  heroTitle?: string
  heroSubtitle?: string
  heroImages?: SanityImage[]
  featuredProducts?: ProductCard[]
  featuredProjects?: ProjectCard[]
  whyItems?: TextItem[]
  processSteps?: TextItem[]
  ctaTitle?: string
  ctaText?: string
  ctaImage?: SanityImage
}

export type AboutPage = {
  eyebrow?: string
  title?: string
  introduction?: string
  companyStory?: PortableTextBlock[]
  mission?: string
  values?: TextItem[]
  expertise?: TextItem[]
  materialsText?: string
  processSteps?: TextItem[]
  images?: SanityImage[]
}
