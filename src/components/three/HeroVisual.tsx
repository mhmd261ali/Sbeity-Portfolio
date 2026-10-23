import { useEffect, type RefObject } from 'react'
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { SanityImage } from '@/components/galleries/SanityImage'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { hasImage } from '@/lib/sanity/image'
import type { SanityImage as SanityImageData } from '@/types/content'

const fallbacks: NonNullable<SanityImageData>[] = [
  { alt: 'طباعة كانفس', src: '/templates/canvas.jpg' },
  { alt: 'جدار منسق', src: '/templates/living.jpg' },
]

export function useHeroMotion(sectionRef: RefObject<HTMLElement | null>) {
  const reduced = usePrefersReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const pointerX = useSpring(rawX, { stiffness: 140, damping: 18, mass: 0.4 })
  const pointerY = useSpring(rawY, { stiffness: 140, damping: 18, mass: 0.4 })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reset = () => {
      rawX.set(0)
      rawY.set(0)
    }

    if (reduced) {
      reset()
      return
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = section.getBoundingClientRect()
      rawX.set((event.clientX - rect.left) / rect.width - 0.5)
      rawY.set((event.clientY - rect.top) / rect.height - 0.5)
    }

    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', reset)
    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', reset)
    }
  }, [rawX, rawY, reduced, sectionRef])

  const textX = useTransform(pointerX, (value) => (reduced ? 0 : value * -28))
  const textY = useTransform(pointerY, (value) => (reduced ? 0 : value * -16))

  return { pointerX, pointerY, scrollYProgress, reduced, textX, textY }
}

export function HeroVisual({
  images,
  motion: hero,
}: {
  images?: Array<SanityImageData | undefined>
  motion: ReturnType<typeof useHeroMotion>
}) {
  const reduced = hero.reduced
  const pointerX = hero.pointerX
  const pointerY = hero.pointerY
  const scrollYProgress = hero.scrollYProgress
  const float = useMotionValue(0)

  useAnimationFrame((time) => {
    float.set(reduced ? 0 : Math.sin(time / 1300) * 16)
  })

  const supplied = (images ?? []).filter(hasImage)
  const photos = [supplied[0] ?? fallbacks[0], supplied[1] ?? fallbacks[1]]

  return (
    <div dir="ltr" className="relative h-full w-full">
      <div aria-hidden className="pointer-events-none absolute bottom-[7%] left-1/2 h-12 w-[68%] -translate-x-1/2 rounded-full bg-blue/10 blur-2xl" />
      <motion.div className="relative h-full w-full" style={{ y: float }}>
      <Shape className="left-[6%] top-[16%] h-[54%] w-[58%] rounded-[2rem] bg-[#f3efe4]" rotate={-12} scroll={scrollYProgress} pointer={pointerY} reduced={reduced} range={[28, -36]} strength={24} />
      <Shape className="right-[8%] top-[24%] h-[44%] w-[46%] rounded-[1.8rem] border border-blue/20" rotate={9} scroll={scrollYProgress} pointer={pointerY} reduced={reduced} range={[-18, 30]} strength={-18} />
      <Shape className="left-[2%] top-[8%] h-40 w-40 rounded-full border border-blue/25 sm:h-52 sm:w-52" scroll={scrollYProgress} pointer={pointerX} reduced={reduced} range={[-24, 36]} strength={32} />
      <Shape className="bottom-[10%] right-[8%] h-20 w-20 rounded-full border border-gold-deep/80 sm:h-28 sm:w-28" scroll={scrollYProgress} pointer={pointerY} reduced={reduced} range={[30, -24]} strength={-22} />
      <Shape className="right-[18%] top-[4%] h-10 w-10 rounded-full border border-blue/30" scroll={scrollYProgress} pointer={pointerX} reduced={reduced} range={[10, -22]} strength={18} />

      <Photo
        image={photos[0]}
        className="right-[6%] top-[10%] z-10 w-[58%]"
        frame="aspect-[5/4]"
        rotate={7}
        scroll={scrollYProgress}
        pointerX={pointerX}
        pointerY={pointerY}
        reduced={reduced}
        depth={1}
      />
      <Photo
        image={photos[1]}
        className="bottom-[8%] left-[6%] z-20 w-[50%]"
        frame="aspect-[4/5]"
        rotate={-8}
        scroll={scrollYProgress}
        pointerX={pointerX}
        pointerY={pointerY}
        reduced={reduced}
        depth={1.55}
      />
      </motion.div>
    </div>
  )
}

function Shape({
  className,
  rotate = 0,
  scroll,
  pointer,
  reduced,
  range,
  strength,
}: {
  className: string
  rotate?: number
  scroll: MotionValue<number>
  pointer: MotionValue<number>
  reduced: boolean
  range: [number, number]
  strength: number
}) {
  const y = useDrift(scroll, pointer, reduced, range, strength)
  return <motion.div aria-hidden className={`pointer-events-none absolute ${className}`} style={{ y, rotate }} />
}

function Photo({
  image,
  className,
  frame,
  rotate,
  scroll,
  pointerX,
  pointerY,
  reduced,
  depth,
}: {
  image: NonNullable<SanityImageData>
  className: string
  frame: string
  rotate: number
  scroll: MotionValue<number>
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  reduced: boolean
  depth: number
}) {
  const y = useDrift(scroll, pointerY, reduced, [48 * depth, -70 * depth], 36 * depth)
  const x = useTransform(pointerX, (value) => (reduced ? 0 : value * 56 * depth))

  return (
    <motion.figure
      className={`absolute overflow-hidden shadow-[0_28px_50px_-30px_rgba(0,48,72,0.55)] ${className}`}
      style={{ x, y, rotate }}
      whileHover={reduced ? undefined : { scale: 1.045, rotate: rotate + (rotate > 0 ? 3 : -3), zIndex: 30 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
    >
      <div className={`overflow-hidden bg-foam ${frame}`}>
        <SanityImage image={image} alt={image.alt} priority sizes="(min-width: 1024px) 32vw, 70vw" />
      </div>
    </motion.figure>
  )
}

function useDrift(
  scroll: MotionValue<number>,
  pointer: MotionValue<number>,
  reduced: boolean,
  range: [number, number],
  pointerStrength: number,
) {
  const fromScroll = useTransform(scroll, [0, 1], reduced ? [0, 0] : range)
  const fromPointer = useTransform(pointer, (value) => (reduced ? 0 : value * pointerStrength))
  return useTransform([fromScroll, fromPointer], ([scrollOffset, pointerOffset]) => Number(scrollOffset) + Number(pointerOffset))
}
