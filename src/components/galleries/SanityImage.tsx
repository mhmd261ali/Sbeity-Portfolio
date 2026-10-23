import { useState } from 'react'
import { imageSrcSet, imageUrl, objectPosition } from '@/lib/sanity/image'
import type { SanityImage as SanityImageData } from '@/types/content'
import { cn } from '@/utils/cn'

export function ImagePlaceholder({ label }: { label?: string }) {
  return (
    <div role="img" aria-label={label || 'صورة غير متاحة'} className="grid h-full min-h-40 w-full place-items-center bg-mist">
      <img src="/brand/logo.png" alt="" className="h-16 w-16 opacity-80" />
    </div>
  )
}

export function SanityImage({
  image,
  alt,
  width = 1600,
  sizes = '100vw',
  className,
  priority = false,
}: {
  image?: SanityImageData
  alt?: string
  width?: number
  sizes?: string
  className?: string
  priority?: boolean
}) {
  const [loaded, setLoaded] = useState(false)
  const src = imageUrl(image, width)
  const lqip = image?.asset?.metadata?.lqip
  const label = alt || image?.alt || ''

  if (!src) return <ImagePlaceholder label={label} />

  return (
    <div className={cn('relative h-full w-full overflow-hidden bg-foam', className)}>
      {lqip && !loaded && <img src={lqip} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-105 object-cover blur-xl" />}
      {!loaded && !lqip && <div className="absolute inset-0 animate-pulse bg-foam" />}
      <img
        src={src}
        srcSet={imageSrcSet(image)}
        sizes={sizes}
        alt={label}
        width={image?.asset?.metadata?.dimensions?.width}
        height={image?.asset?.metadata?.dimensions?.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={{ objectPosition: objectPosition(image) }}
        className={cn('h-full w-full object-cover transition-opacity duration-700', loaded ? 'opacity-100' : 'opacity-0')}
      />
    </div>
  )
}
