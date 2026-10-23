import { SanityImage } from '@/components/galleries/SanityImage'
import { hasImage } from '@/lib/sanity/image'
import type { SanityImage as SanityImageData } from '@/types/content'

const fallbacks: SanityImageData[] = [
  { alt: 'طاولة تجهيز قطعة مطبوعة', src: '/templates/wood.jpg' },
  { alt: 'طباعة كانفس زهرية', src: '/templates/canvas.jpg' },
]

export function HeroCollage({ images }: { images?: Array<SanityImageData | null | undefined> }) {
  const photos = (images ?? []).filter(hasImage)
  const primary = photos[0] ?? fallbacks[0]
  const secondary = photos[1] ?? fallbacks[1]

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-[0%] top-[8%] aspect-square w-[72%] rounded-full border border-[#c5d7bf]" aria-hidden />

      <div className="absolute bottom-[6%] right-[6%] top-[8%] z-10 w-[66%]">
        <div className="absolute -inset-3 -translate-x-6 -rotate-[14deg] bg-[#d7efe8]" aria-hidden />
        <figure className="relative z-10 h-full rotate-[6deg] overflow-hidden bg-white shadow-[0_28px_55px_-28px_rgba(0,48,72,0.55)]">
          <SanityImage image={primary} alt={primary.alt || 'قطعة مطبوعة'} priority sizes="(min-width: 1024px) 34vw, 86vw" />
        </figure>
      </div>

      <div className="absolute bottom-[6%] left-[2%] z-20 w-[48%]">
        <div className="absolute -inset-3 -translate-x-6 rotate-[15deg] bg-[#f4e4dc]" aria-hidden />
        <figure className="relative z-10 -rotate-[8deg] overflow-hidden bg-white shadow-[0_22px_46px_-20px_rgba(0,48,72,0.5)]">
          <div className="aspect-[4/5]">
            <SanityImage image={secondary} alt={secondary.alt || 'عمل مطبوع'} priority sizes="(min-width: 1024px) 24vw, 58vw" />
          </div>
        </figure>
      </div>

      <div className="absolute bottom-[9%] left-[46%] z-30 h-11 w-11 rounded-full bg-gold shadow-[0_12px_30px_-12px_rgba(0,48,72,0.45)]" aria-hidden />
    </div>
  )
}
