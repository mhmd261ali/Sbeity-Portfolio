import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { SanityImage } from '@/components/galleries/SanityImage'
import type { SanityImage as SanityImageData } from '@/types/content'

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value?: SanityImageData }) => (
      <SanityImage image={value} alt={value?.alt} sizes="(min-width: 768px) 720px, 100vw" className="rounded-3xl" />
    ),
  },
}

export function RichText({ value }: { value?: PortableTextBlock[] | null }) {
  if (!value?.length) return null
  return (
    <div className="rich-text text-lg">
      <PortableText value={value} components={components} />
    </div>
  )
}
