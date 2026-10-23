import { createImageUrlBuilder } from '@sanity/image-url'
import { sanityConfig, isSanityConfigured } from '@/lib/sanity/client'
import type { SanityImage } from '@/types/content'

const builder = isSanityConfigured()
  ? createImageUrlBuilder({ projectId: sanityConfig.projectId, dataset: sanityConfig.dataset })
  : null

export function hasImage(image: SanityImage | undefined | null): image is NonNullable<SanityImage> {
  if (!image) return false
  return Boolean(image.src || image.asset?._id)
}

export function imageUrl(image: SanityImage | undefined, width: number) {
  if (image?.src) return image.src
  const assetId = image?.asset?._id
  if (!builder || !image || !assetId) return null

  try {
    return builder
      .image({
        asset: { _ref: assetId },
        crop: image.crop,
        hotspot: image.hotspot,
      })
      .width(width)
      .auto('format')
      .quality(78)
      .url()
  } catch {
    return null
  }
}

export function imageSrcSet(image: SanityImage | undefined, widths = [480, 800, 1200, 1800]) {
  if (image?.src) return ''
  return widths
    .map((width) => {
      const url = imageUrl(image, width)
      return url ? `${url} ${width}w` : null
    })
    .filter((value): value is string => Boolean(value))
    .join(', ')
}

export function objectPosition(image: SanityImage | undefined) {
  if (!image?.hotspot) return 'center'
  return `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
}
