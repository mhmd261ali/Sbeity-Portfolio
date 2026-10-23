import type { ReactNode } from 'react'
import { Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router'
import { navLinks } from '@/components/navigation/links'
import { useSite } from '@/components/layout/SiteContext'
import { preview } from '@/content/preview'
import { digitsOnly, mapsHref, whatsappHref } from '@/utils/whatsapp'

export function Footer() {
  const { companyName, logoUrl, settings } = useSite()
  const contact = settings ?? preview.settings
  const year = new Date().getFullYear()
  const map = mapsHref(contact.address, contact.googleMapsUrl)
  const whatsapp = contact.whatsapp
    ? whatsappHref(contact.whatsapp, `مرحباً ${companyName}، أود الاستفسار عن عمل حسب الطلب.`)
    : null

  return (
    <footer className="bg-[#f3e6d0] text-blue">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-14 md:grid-cols-3 md:px-8 lg:px-12" dir="ltr">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-gold-deep">تواصلوا معنا</h2>
          <ul className="mt-6 space-y-4 text-sm text-blue/80">
            {contact.address && (
              <li>
                <ContactRow icon={<MapPin className="h-4 w-4" aria-hidden />} href={map || undefined} external={Boolean(map)}>
                  {contact.address}
                </ContactRow>
              </li>
            )}
            {contact.email && (
              <li>
                <ContactRow icon={<Mail className="h-4 w-4" aria-hidden />} href={`mailto:${contact.email}`}>
                  {contact.email}
                </ContactRow>
              </li>
            )}
            {whatsapp && contact.whatsapp && (
              <li>
                <ContactRow icon={<WhatsAppMark />} href={whatsapp} external>
                  {shownNumber(contact.whatsapp, contact.phone)}
                </ContactRow>
              </li>
            )}
          </ul>
        </div>

        <Link to="/" aria-label={companyName} className="flex flex-col items-center gap-3">
          <img src={logoUrl || '/brand/logo.png'} alt="" className="h-20 w-20 object-contain" />
          <span className="font-display text-3xl leading-none">{companyName}</span>
        </Link>

        <nav aria-label="تصفح الموقع" className="md:justify-self-end" dir="rtl">
          <h2 className="text-sm font-semibold tracking-wide text-gold-deep">التصفح</h2>
          <ul className="mt-6 space-y-3">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="whitespace-nowrap text-sm font-semibold text-blue/80 transition hover:text-gold-deep">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-blue/10">
        <p className="mx-auto max-w-[1440px] px-5 py-5 text-center text-sm text-blue/60 md:px-8 lg:px-12">
          © {year} {companyName}. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  )
}

function shownNumber(whatsapp: string, phone?: string) {
  if (phone && digitsOnly(phone) === digitsOnly(whatsapp)) return phone
  const trimmed = whatsapp.trim()
  return trimmed.startsWith('+') ? trimmed : `+${digitsOnly(trimmed) || trimmed}`
}

function ContactRow({
  icon,
  href,
  external = false,
  children,
}: {
  icon: ReactNode
  href?: string
  external?: boolean
  children: ReactNode
}) {
  const body = (
    <>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-blue">{icon}</span>
      <span dir="auto">{children}</span>
    </>
  )
  const className = 'inline-flex items-center gap-3 transition hover:text-gold-deep'
  if (!href) return <span className={className}>{body}</span>
  return (
    <a href={href} className={className} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {body}
    </a>
  )
}

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="currentColor"
        d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 12 23a11 11 0 0 0 8.5-19.5ZM12 21a9 9 0 0 1-4.6-1.3l-.3-.2-3.8.6.6-3.7-.2-.3A9 9 0 1 1 12 21Zm5-6.7c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1 2.6 11.4 11.4 0 0 0 4.3 3.8c1.6.6 2.2.7 3 .6a2.5 2.5 0 0 0 1.7-1.2 2 2 0 0 0 .1-1.2c-.1-.1-.3-.2-.6-.3Z"
      />
    </svg>
  )
}
