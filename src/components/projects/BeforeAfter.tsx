import { useState } from 'react'
import { SanityImage } from '@/components/galleries/SanityImage'
import { hasImage } from '@/lib/sanity/image'
import type { SanityImage as SanityImageData } from '@/types/content'

export function BeforeAfter({ before, after }: { before?: SanityImageData; after?: SanityImageData }) {
  const [value, setValue] = useState(56)
  if (!hasImage(before) || !hasImage(after)) return null

  return (
    <figure className="mt-12" dir="ltr">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.8rem] bg-foam">
        <SanityImage image={after} alt={after.alt || 'بعد التنفيذ'} sizes="100vw" className="absolute inset-0" />
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${value}%` }}>
          <div className="relative h-full" style={{ width: `${(100 / value) * 100}%`, maxWidth: 'none' }}>
            <SanityImage image={before} alt={before.alt || 'قبل التنفيذ'} sizes="100vw" className="absolute inset-0" />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${value}%` }}>
          <div className="absolute inset-y-0 -translate-x-1/2 border-l-2 border-white" />
          <div className="absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold text-xs font-bold text-blue">
            ↔
          </div>
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue">قبل</span>
        <span className="absolute right-4 top-4 rounded-full bg-blue px-3 py-1 text-xs font-semibold text-white">بعد</span>
        <input
          type="range"
          min={8}
          max={92}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          aria-label="مقارنة الصورة قبل التنفيذ وبعده"
          className="absolute inset-0 cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted" dir="rtl">
        اسحبوا الخط لمقارنة الفكرة بالنتيجة المطبوعة.
      </figcaption>
    </figure>
  )
}
