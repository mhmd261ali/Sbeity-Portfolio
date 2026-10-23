import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { Reveal } from '@/components/animations/Reveal'
import { Lightbox } from '@/components/galleries/Lightbox'
import { SanityImage } from '@/components/galleries/SanityImage'
import { RichText } from '@/components/content/RichText'
import { useSite } from '@/components/layout/SiteContext'
import { ProductCard } from '@/components/products/ProductCard'
import { Seo, siteOrigin } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { useAsync } from '@/hooks/useAsync'
import { hasImage, imageUrl } from '@/lib/sanity/image'
import { getProduct } from '@/lib/sanity/fetchers'
import type { SanityImage as SanityImageData } from '@/types/content'
import { whatsappHref } from '@/utils/whatsapp'

export function ProductDetailPage() {
  const { slug = '' } = useParams()
  const site = useSite()
  const state = useAsync(() => getProduct(slug), [slug])
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const product = state.data?.product
  const images = product ? [product.mainImage, ...(product.gallery ?? [])].filter((image): image is NonNullable<SanityImageData> => hasImage(image)) : []
  const current = images[active] || images[0]

  async function share() {
    const url = window.location.href
    if (navigator.share && product) {
      try {
        await navigator.share({ title: product.title, url })
        return
      } catch {
        return
      }
    }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  if (state.status === 'loading') {
    return (
      <Container className="grid gap-8 pt-32 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-[2rem] bg-foam" />
        <div className="space-y-4 pt-6">
          <div className="h-8 w-40 animate-pulse rounded-full bg-foam" />
          <div className="h-16 w-4/5 animate-pulse rounded-2xl bg-foam" />
        </div>
      </Container>
    )
  }

  if (state.status === 'error') {
    return (
      <Container className="pt-32">
        <ErrorState onRetry={() => window.location.reload()} />
      </Container>
    )
  }

  if (!product) {
    return (
      <Container className="pt-32">
        <EmptyState title="المنتج غير متاح" text="ربما لم يُنشر بعد، أو أن الرابط تغيّر." action={{ to: '/products', label: 'كل المنتجات' }} />
      </Container>
    )
  }

  const quote = `/contact?product=${product.slug}&intent=quote`
  const ask = `/contact?product=${product.slug}&intent=ask`
  const whatsapp = site.settings?.whatsapp ? whatsappHref(site.settings.whatsapp, `مرحباً، أود الاستفسار عن «${product.title}».`) : null
  const origin = siteOrigin()

  return (
    <article className="pb-24 pt-28">
      <Seo
        title={`${product.title} | ${site.companyName}`}
        description={product.shortDescription || site.description}
        path={`/products/${product.slug}`}
        image={imageUrl(product.mainImage, 1400) || undefined}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: product.title,
          description: product.shortDescription,
          image: imageUrl(product.mainImage, 1400),
          url: `${origin}/products/${product.slug}`,
          creator: { '@type': 'Organization', name: site.companyName },
        }}
      />
      <Container>
        <nav className="text-sm text-muted" aria-label="مسار التنقل">
          <Link to="/" className="hover:text-blue">الرئيسية</Link>
          <span className="px-2">/</span>
          <Link to="/products" className="hover:text-blue">المنتجات</Link>
          <span className="px-2">/</span>
          <span className="text-blue">{product.title}</span>
        </nav>
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal from="left">
          <div>
            <button type="button" className="block w-full overflow-hidden rounded-[1.8rem]" onClick={() => setOpen(true)} aria-label="تكبير الصورة">
              <div className="aspect-[4/5] md:aspect-square">
                <SanityImage image={current} priority sizes="(min-width: 1024px) 55vw, 100vw" />
              </div>
            </button>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button key={image?.asset?._id || index} type="button" onClick={() => setActive(index)} className={`overflow-hidden rounded-2xl border-2 ${index === active ? 'border-gold' : 'border-transparent'}`} aria-label={`الصورة ${index + 1}`}>
                    <div className="aspect-square">
                      <SanityImage image={image} width={400} sizes="20vw" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          </Reveal>
          <Reveal from="right">
          <div className="lg:pt-4">
            {product.category?.title && <p className="text-sm font-semibold text-blue">{product.category.title}</p>}
            <h1 className="mt-3 font-display text-4xl leading-tight text-blue md:text-6xl">{product.title}</h1>
            {product.shortDescription && <p className="mt-5 text-lg leading-8 text-muted">{product.shortDescription}</p>}
            {product.featured && <p className="mt-4 inline-flex rounded-full bg-gold px-3 py-1 text-xs font-semibold text-blue">منتج مختار</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={quote} size="lg">اطلبوا عرض سعر</Button>
              <Button to={ask} variant="line" size="lg">اسألوا عن هذا المنتج</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noreferrer" className="text-blue underline decoration-gold underline-offset-4">
                  واتساب برسالة جاهزة
                </a>
              )}
              <button type="button" onClick={() => void share()} className="text-blue underline decoration-gold underline-offset-4">
                {copied ? 'تم نسخ الرابط' : 'مشاركة المنتج'}
              </button>
            </div>
            <RichText value={product.description} />
            <OptionList title="الخامات" items={product.materials} />
            <OptionList title="المقاسات" items={product.sizes} />
            <OptionList title="يمكن تخصيصه بـ" items={product.customizationOptions} />
          </div>
          </Reveal>
        </div>
        {!!product.related?.length && (
          <Reveal>
          <section className="mt-20">
            <h2 className="font-display text-4xl text-blue">من التصنيف نفسه</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {product.related.map((item) => (
                <ProductCard key={item._id} product={item} imageClassName="aspect-[4/5]" />
              ))}
            </div>
          </section>
          </Reveal>
        )}
      </Container>
      {open && images.length > 0 && (
        <Lightbox
          images={images}
          index={active}
          onClose={() => setOpen(false)}
          onStep={(delta) => setActive((value) => (value + delta + images.length) % images.length)}
        />
      )}
    </article>
  )
}

function OptionList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null
  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold text-blue">{title}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-full bg-mist px-4 py-2 text-sm text-blue">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
