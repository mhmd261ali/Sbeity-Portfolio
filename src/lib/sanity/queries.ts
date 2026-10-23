const imageFields = `{
  alt,
  crop,
  hotspot,
  asset->{
    _id,
    metadata { lqip, dimensions }
  }
}`

const categoryFields = `{
  title,
  "slug": slug.current
}`

const productCardFields = `
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  featured,
  displayOrder,
  _createdAt,
  _updatedAt,
  "category": category->${categoryFields},
  mainImage${imageFields}
`

const projectCardFields = `
  _id,
  title,
  "slug": slug.current,
  summary,
  client,
  year,
  featured,
  _createdAt,
  _updatedAt,
  "category": category->${categoryFields},
  coverImage${imageFields}
`

export const siteSettingsQuery = `*[_id == "siteSettings"][0]{
  companyName,
  tagline,
  description,
  email,
  phone,
  whatsapp,
  address,
  googleMapsUrl,
  seoTitle,
  seoDescription,
  socialLinks[]{ _key, platform, url },
  logo${imageFields},
  favicon${imageFields},
  ogImage${imageFields}
}`

export const homepageQuery = `*[_id == "homepage"][0]{
  eyebrow,
  heroTitle,
  heroSubtitle,
  ctaTitle,
  ctaText,
  heroImages[]${imageFields},
  whyItems[]{ _key, title, description },
  processSteps[]{ _key, title, description },
  ctaImage${imageFields},
  featuredProducts[]->{ ${productCardFields} },
  featuredProjects[]->{ ${projectCardFields} }
}`

export const aboutQuery = `*[_id == "aboutPage"][0]{
  eyebrow,
  title,
  introduction,
  mission,
  materialsText,
  companyStory,
  values[]{ _key, title, description },
  expertise[]{ _key, title, description },
  processSteps[]{ _key, title, description },
  images[]${imageFields}
}`

export const categoriesQuery = `*[_type == "category"] | order(displayOrder asc, title asc){
  _id,
  title,
  "slug": slug.current,
  description,
  displayOrder,
  image${imageFields}
}`

export const servicesQuery = `*[_type == "service"] | order(displayOrder asc, title asc){
  _id,
  title,
  "slug": slug.current,
  description,
  icon,
  displayOrder,
  image${imageFields},
  "category": category->${categoryFields}
}`

export const testimonialsQuery = `*[_type == "testimonial" && featured == true] | order(_createdAt desc){
  _id,
  customerName,
  role,
  content,
  rating,
  featured
}`

export const productsQuery = `*[_type == "product"] | order(displayOrder asc, _createdAt desc){
  ${productCardFields}
}`

export const projectsQuery = `*[_type == "project"] | order(displayOrder asc, year desc){
  ${projectCardFields}
}`

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0]{
  ${productCardFields},
  description,
  materials,
  sizes,
  customizationOptions,
  gallery[]${imageFields},
  "related": *[_type == "product" && category._ref == ^.category._ref && slug.current != $slug] | order(displayOrder asc, _createdAt desc)[0...3]{
    ${productCardFields}
  }
}`

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0]{
  ${projectCardFields},
  description,
  services,
  materials,
  images[]${imageFields},
  beforeImage${imageFields},
  afterImage${imageFields},
  "related": *[_type == "project" && slug.current != $slug && (
    category._ref == ^.category._ref || featured == true
  )] | order(displayOrder asc)[0...3]{
    ${projectCardFields}
  }
}`

export const productTitleQuery = `*[_type == "product" && slug.current == $slug][0]{ title, "slug": slug.current }`

export const sitemapQuery = `{
  "products": *[_type == "product"]{ title, "slug": slug.current, _updatedAt, "image": mainImage.asset->url },
  "projects": *[_type == "project"]{ title, "slug": slug.current, _updatedAt, "image": coverImage.asset->url }
}`
