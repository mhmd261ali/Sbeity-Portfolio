import type { ComponentType, SVGProps } from 'react'
import { useSearchParams } from 'react-router'
import { Reveal } from '@/components/animations/Reveal'
import { CanvasStand } from '@/components/contact/CanvasStand'
import { ContactForm } from '@/components/forms/ContactForm'
import { useSite } from '@/components/layout/SiteContext'
import { Seo } from '@/components/seo/Seo'
import { Container } from '@/components/ui/Container'
import { useAsync } from '@/hooks/useAsync'
import { getProductTitle, getServices } from '@/lib/sanity/fetchers'
import { cn } from '@/utils/cn'
import { mapsHref, telHref, whatsappHref } from '@/utils/whatsapp'

const socials = [
  { platform: 'instagram', label: 'إنستغرام', icon: InstagramIcon, tone: 'text-[#C13584]' },
  { platform: 'facebook', label: 'فيسبوك', icon: FacebookIcon, tone: 'text-[#1877F2]' },
  { platform: 'tiktok', label: 'تيك توك', icon: TikTokIcon, tone: 'text-blue' },
] as const

export function ContactPage() {
  const site = useSite()
  const [params] = useSearchParams()
  const productSlug = params.get('product') || ''
  const intent = params.get('intent') || 'quote'
  const productState = useAsync(() => getProductTitle(productSlug), [productSlug])
  const servicesState = useAsync(() => getServices(), [])
  const productTitle = productState.data?.title || ''
  const services = servicesState.data?.services ?? []
  const phone = telHref(site.settings?.phone)
  const map = mapsHref(site.settings?.address, site.settings?.googleMapsUrl)
  const whatsapp = site.settings?.whatsapp
    ? whatsappHref(
        site.settings.whatsapp,
        productTitle ? `مرحباً، أود الاستفسار عن «${productTitle}».` : `مرحباً ${site.companyName}، أود الاستفسار عن عمل حسب الطلب.`,
      )
    : null
  const links = socials.map((item) => ({
    ...item,
    href: site.settings?.socialLinks?.find((link) => link.platform === item.platform)?.url || '',
  }))

  return (
    <div className="bg-[#e4e4e4] pt-28 md:pt-32">
      <Seo title={`تواصلوا معنا | ${site.companyName}`} description="اطلبوا عرض سعر أو اسألوا عن قطعة. لا دفع إلكتروني في هذا الموقع." path="/contact" />
      <Container>
        <Reveal>
          <CanvasStand>
            <p className="flex items-center gap-3 text-lg font-semibold text-blue lg:text-3xl">
              <span className="h-px w-10 bg-gold" aria-hidden />
              ابدأوا الحوار
            </p>
            <h1 className="mt-3 font-display text-2xl leading-tight text-blue lg:text-[3rem]">أخبرونا بالقطعة التي في بالكم</h1>
            <div className="mt-8 lg:mt-12">
              <ContactForm
                canvas
                productSlug={productSlug}
                productTitle={productTitle}
                intent={intent}
                services={services}
                actions={<SocialRow links={[...links, { platform: 'whatsapp', label: 'واتساب', icon: WhatsAppIcon, tone: 'text-[#25D366]', href: whatsapp || '' }]} />}
              />
            </div>
          </CanvasStand>
        </Reveal>
        {(site.settings?.email || phone || site.settings?.address || map) && (
          <div className="mx-auto mt-10 max-w-3xl space-y-3 text-center text-xl leading-9 text-blue">
            {site.settings?.email && (
              <p>
                <a href={`mailto:${site.settings.email}`} className="font-semibold underline decoration-gold underline-offset-4">{site.settings.email}</a>
              </p>
            )}
            {phone && site.settings?.phone && (
              <p>
                <a href={phone} className="font-semibold underline decoration-gold underline-offset-4">{site.settings.phone}</a>
              </p>
            )}
            {site.settings?.address && <p>{site.settings.address}</p>}
            {map && (
              <p>
                <a href={map} target="_blank" rel="noreferrer" className="font-semibold underline decoration-gold underline-offset-4">فتح الخريطة</a>
              </p>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}

function SocialRow({ links }: { links: { platform: string; href: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>>; tone: string }[] }) {
  return (
    <ul className="flex items-center gap-3" aria-label="وسائل التواصل">
      {links.map((item) => {
        const Icon = item.icon
        const icon = <Icon className={cn('h-8 w-8 lg:h-14 lg:w-14', item.tone)} />
        return (
          <li key={item.platform}>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noreferrer" aria-label={item.label} className="inline-flex rounded-full p-1 transition hover:opacity-70">
                {icon}
              </a>
            ) : (
              <span className="inline-flex p-1 opacity-70" aria-label={item.label}>
                {icon}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M14 8.2h2.4V5.2H14c-2.1 0-3.8 1.7-3.8 3.8v1.8H8v2.8h2.2V20h2.8v-6.4h2.2l.4-2.8h-2.6V9.2c0-.6.4-1 1-1z" />
    </svg>
  )
}

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden {...props}>
      <path d="M14 4h2.2a5.2 5.2 0 0 0 3.3 3.1v2.2a7.4 7.4 0 0 1-3.4-1v6.4a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v2.3a3.1 3.1 0 1 0 2.2 3V4z" />
    </svg>
  )
}

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden {...props}>
      <path d="M12 4.2a7.6 7.6 0 0 0-6.6 11.3L4.4 20l4.6-1.2A7.6 7.6 0 1 0 12 4.2z" />
      <path d="M9.2 9.4c.2-.4.4-.4.6-.4h.4c.2 0 .3.1.4.4.2.6.7 1.6.7 1.7s0 .3-.2.5c-.1.2-.2.3-.1.5.2.4.8 1.2 1.6 1.6.6.4 1 .5 1.2.4.2-.1.6-.7.8-.9.1-.2.3-.2.5-.1l1.3.6c.2.1.3.2.3.4.1.6-.2 1.2-.6 1.5-.4.3-1 .6-1.6.5-.5-.1-1.1-.3-1.8-.7-1.6-.9-2.8-2.4-3-2.6-.2-.3-.9-1.2-.9-2.2s.6-1.6.8-1.8z" />
    </svg>
  )
}
