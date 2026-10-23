import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { SanityImage } from '@/components/galleries/SanityImage'
import { useLockBody } from '@/hooks/useLockBody'
import type { SanityImage as SanityImageData } from '@/types/content'

export function Lightbox({
  images,
  index,
  onClose,
  onStep,
}: {
  images: SanityImageData[]
  index: number
  onClose: () => void
  onStep: (delta: number) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const startX = useRef(0)
  const image = images[index]
  useLockBody(true)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onStep(1)
      if (event.key === 'ArrowRight') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onStep])

  if (!image) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-blue-deep/92 p-4 text-white" role="dialog" aria-modal="true" aria-label="عرض الصورة">
      <button ref={closeRef} type="button" onClick={onClose} className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-blue" aria-label="إغلاق">
        <X />
      </button>
      <p className="absolute right-5 top-6 text-sm text-white/80">
        {index + 1} / {images.length}
      </p>
      <button type="button" onClick={() => onStep(-1)} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 md:right-6" aria-label="الصورة السابقة">
        <ChevronRight />
      </button>
      <button type="button" onClick={() => onStep(1)} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 md:left-6" aria-label="الصورة التالية">
        <ChevronLeft />
      </button>
      <div
        className="h-[min(78vh,860px)] w-[min(1100px,92vw)]"
        onPointerDown={(event) => {
          startX.current = event.clientX
        }}
        onPointerUp={(event) => {
          const delta = event.clientX - startX.current
          if (delta > 48) onStep(-1)
          if (delta < -48) onStep(1)
        }}
      >
        <SanityImage image={image} width={2000} sizes="92vw" priority className="rounded-2xl" />
      </div>
    </div>
  )
}
