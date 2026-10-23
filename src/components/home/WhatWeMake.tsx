import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { Link } from 'react-router'
import { SanityImage } from '@/components/galleries/SanityImage'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { hasImage } from '@/lib/sanity/image'
import type { SanityImage as SanityImageData } from '@/types/content'

export type CraftPiece = {
  title: string
  description: string
  href: string
  image?: SanityImageData
}

const fallbackImage: NonNullable<SanityImageData> = { alt: 'لوحة كانفس', src: '/templates/canvas.jpg' }

export function WhatWeMake({ pieces }: { pieces: CraftPiece[] }) {
  const reduced = usePrefersReducedMotion()
  const narrow = useMediaQuery('(max-width: 767px)')
  const ref = useRef<HTMLElement>(null)
  const phase = useRef<'big' | 'small'>('big')
  const busy = useRef(false)
  const scrollYProgress = useMotionValue(0)
  const list = pieces.length
    ? pieces
    : [{ title: 'طباعة الكانفس', description: 'نطبع الصورة على قماش مشدود بإطار خشبي، فتُعلَّق على الجدار كلوحة لا كملصق.', href: '/products/premium-wall-canvas', image: fallbackImage }]
  const [index, setIndex] = useState(0)
  const [visualIndex, setVisualIndex] = useState(0)
  const [textSide, setTextSide] = useState<'left' | 'right'>('right')
  const indexRef = useRef(0)
  const visualRef = useRef(0)
  const countRef = useRef(list.length)
  const swapLock = useRef(false)
  const onSwapDone = useRef<() => void>(() => {})
  countRef.current = list.length
  const active = Math.min(visualIndex, list.length - 1)
  const piece = list[active]
  const image = hasImage(piece.image) ? piece.image : fallbackImage
  const [viewport, setViewport] = useState(() => ({
    width: typeof window === 'undefined' ? 1280 : window.innerWidth,
    height: typeof window === 'undefined' ? 800 : window.innerHeight,
  }))

  useEffect(() => {
    const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const section = ref.current
    if (!section || reduced) return

    let pinned = false
    let mode: 'free' | 'hold-big' | 'hold-small' = 'free'
    let gate: 'closed' | 'open' = 'closed'
    let correcting = false
    let disposed = false
    let idleTimer = 0
    let touchStart = 0
    let swapTimer = 0
    let lastY = window.scrollY
    let lastSectionTop = section.getBoundingClientRect().top
    let animation: { stop: () => void } | undefined

    const pin = () => {
      if (correcting) return
      const rect = section.getBoundingClientRect()
      const target = Math.round(window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2)
      if (Math.abs(window.scrollY - target) <= 1) return
      correcting = true
      const root = document.documentElement
      const previous = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      window.scrollTo(0, target)
      root.style.scrollBehavior = previous
      correcting = false
      lastY = window.scrollY
      lastSectionTop = section.getBoundingClientRect().top
    }

    const armGate = () => {
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => {
        if (!disposed && pinned && !busy.current) gate = 'open'
      }, 220)
    }

    const play = (next: 'big' | 'small') => {
      mode = next === 'big' ? 'hold-big' : 'hold-small'
      gate = 'closed'
      if (busy.current || phase.current === next) {
        armGate()
        return
      }
      busy.current = true
      phase.current = next
      animation?.stop()
      animation = animate(scrollYProgress, next === 'small' ? 1 : 0, {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
          onComplete: () => {
            busy.current = false
            animation = undefined
            armGate()
            if (next === 'small') revealText.current()
            else hideText.current()
          },
      })
    }

    onSwapDone.current = () => {
      window.clearTimeout(swapTimer)
      if (disposed) return
      busy.current = false
      armGate()
    }

    const hold = (next: 'hold-big' | 'hold-small') => {
      pinned = true
      mode = next
      gate = 'closed'
      pin()
      armGate()
    }

    const release = () => {
      pinned = false
      mode = 'free'
      gate = 'closed'
    }

    const show = (next: number) => {
      const clamped = Math.max(0, Math.min(countRef.current - 1, next))
      if (clamped === indexRef.current) return false
      indexRef.current = clamped
      setIndex(clamped)
      busy.current = true
      gate = 'closed'
      window.clearTimeout(swapTimer)
      swapTimer = window.setTimeout(() => {
        if (disposed) return
        busy.current = false
        armGate()
      }, 2800)
      return true
    }

    const step = (dir: 'down' | 'up') => {
      if (mode === 'hold-big' && dir === 'down') {
        pin()
        play('small')
        return true
      }
      if (mode === 'hold-small' && dir === 'down') {
        if (indexRef.current < countRef.current - 1) {
          pin()
          show(indexRef.current + 1)
          return true
        }
        release()
        return false
      }
      if (mode === 'hold-small' && dir === 'up') {
        pin()
        if (indexRef.current > 0) show(indexRef.current - 1)
        else play('big')
        return true
      }
      release()
      return false
    }

    const centerOffset = () => {
      const rect = section.getBoundingClientRect()
      return rect.top + rect.height / 2 - window.innerHeight / 2
    }

    const catchDirection = (dir: 'down' | 'up', pixels: number) => {
      if (pinned) return true
      const offset = centerOffset()
      if (dir === 'down' && phase.current === 'big') {
        if (offset > 2) return pixels >= offset - 1
        return offset > -64
      }
      if (dir === 'up' && phase.current === 'small') {
        if (offset < -2) return pixels >= -offset - 1
        return offset < 64
      }
      return false
    }

    const take = (dir: 'down' | 'up', pixels: number, force = false) => {
      if (!force && !catchDirection(dir, Math.max(pixels, 48))) return false
      if (pinned && (busy.current || gate !== 'open')) {
        pin()
        if (!busy.current) armGate()
        return true
      }
      if (pinned && gate === 'open') return step(dir)
      hold(dir === 'down' ? 'hold-big' : 'hold-small')
      return true
    }

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return
      const pixels = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * window.innerHeight : event.deltaY
      const dir = pixels > 0 ? 'down' : 'up'
      if (!take(dir, Math.abs(pixels))) return
      event.preventDefault()
    }

    const onScroll = () => {
      if (correcting) return
      const y = window.scrollY
      const delta = y - lastY
      const prevTop = lastSectionTop
      const rect = section.getBoundingClientRect()
      lastY = y
      lastSectionTop = rect.top
      if (Math.abs(delta) <= 1) return
      const dir = delta > 0 ? 'down' : 'up'
      const vh = window.innerHeight
      const offset = rect.top + rect.height / 2 - vh / 2
      const prevOffset = prevTop + rect.height / 2 - vh / 2
      const crossedDown = dir === 'down' && phase.current === 'big' && prevOffset > 2 && offset <= 2
      const crossedUp = dir === 'up' && phase.current === 'small' && prevOffset < -2 && offset >= -2
      if (pinned && !busy.current && gate === 'open' && Math.abs(delta) > 8) {
        step(dir)
        return
      }
      if (pinned) {
        pin()
        if (!busy.current && gate !== 'open') armGate()
        return
      }
      if (crossedDown || crossedUp) take(dir, vh, true)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof HTMLElement && target.closest('input, textarea, select, button, a, [contenteditable="true"]')) return
      const dir = event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ' ? 'down' : event.key === 'ArrowUp' || event.key === 'PageUp' ? 'up' : null
      if (!dir) return
      if (!take(dir, window.innerHeight * 0.8)) return
      event.preventDefault()
    }

    const onTouchStart = (event: TouchEvent) => {
      touchStart = event.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (event: TouchEvent) => {
      const current = event.touches[0]?.clientY ?? touchStart
      const delta = touchStart - current
      if (Math.abs(delta) < 12) return
      const dir = delta > 0 ? 'down' : 'up'
      if (!take(dir, Math.abs(delta))) return
      event.preventDefault()
      touchStart = current
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      disposed = true
      window.clearTimeout(idleTimer)
      window.clearTimeout(swapTimer)
      animation?.stop()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [scrollYProgress, reduced])

  const endWidth = narrow ? Math.max(280, viewport.width - 40) : Math.min(760, Math.max(480, viewport.width - 560))
  const endHeight = Math.round(Math.min(narrow ? viewport.height * 0.4 : 560, endWidth * (560 / 760)))
  const cover = Math.max(viewport.width / endWidth, viewport.height / endHeight)
  const edge = Math.min(72, viewport.width * 0.05)
  const restY = narrow ? Math.max(64, viewport.height * 0.08) : (viewport.height - endHeight) / 2
  const leftX = narrow ? (viewport.width - endWidth) / 2 : edge
  const rightX = narrow ? (viewport.width - endWidth) / 2 : viewport.width - endWidth - edge
  const frameX = useMotionValue((viewport.width - endWidth * cover) / 2)
  const frameY = useMotionValue((viewport.height - endHeight * cover) / 2)
  const frameScale = useMotionValue(cover)
  const frameW = useMotionValue(endWidth)
  const frameH = useMotionValue(endHeight)
  const radius = useMotionValue(0)
  const frameFade = useMotionValue(1)
  const copyGate = useMotionValue(1)
  const revealText = useRef<() => void>(() => {})
  const hideText = useRef<() => void>(() => {})
  const [textToken, setTextToken] = useState(0)
  revealText.current = () => setTextToken((token) => token + 1)
  hideText.current = () => setTextToken(0)
  const metrics = useRef({ endWidth, endHeight, width: viewport.width, height: viewport.height, restY, leftX, rightX })
  metrics.current = { endWidth, endHeight, width: viewport.width, height: viewport.height, restY, leftX, rightX }
  const frameOpacity = useTransform(scrollYProgress, [0.35, 0.85], reduced ? [1, 1] : [0, 1])
  const textOpacity = useTransform(scrollYProgress, [0.45, 0.9], reduced ? [1, 1] : [0, 1])
  const textShift = useTransform(scrollYProgress, [0.45, 0.9], reduced ? [0, 0] : [36, 0])
  const copyOpacity = useTransform([textOpacity, copyGate], ([shown, gate]) => Number(shown) * Number(gate))
  const ringOpacity = useTransform([frameOpacity, radius], ([fade, curve]) => Number(fade) * (Number(curve) > 12 ? 0 : 1))
  const shadow = useTransform(scrollYProgress, (progress) =>
    progress < 0.2 ? '0 0 0 rgba(0,48,72,0)' : '0 34px 50px -24px rgba(0,48,72,0.45)',
  )

  useEffect(() => {
    const apply = () => {
      if (swapLock.current) return
      const progress = scrollYProgress.get()
      const { endWidth: width, endHeight: height, width: viewWidth, height: viewHeight, restY: ground, leftX: landLeft, rightX: landRight } = metrics.current
      const coverScale = Math.max(viewWidth / width, viewHeight / height)
      const startX = (viewWidth - width * coverScale) / 2
      const startY = (viewHeight - height * coverScale) / 2
      const onRight = visualRef.current % 2 === 1 && progress > 0.98
      frameX.set(onRight ? landRight : startX + (landLeft - startX) * progress)
      frameY.set(onRight ? ground : startY + (ground - startY) * progress)
      frameScale.set(onRight ? 1 : coverScale + (1 - coverScale) * progress)
      frameW.set(width)
      frameH.set(height)
      radius.set(0)
      frameFade.set(1)
    }
    const unsub = scrollYProgress.on('change', apply)
    apply()
    return unsub
  }, [cover, endHeight, endWidth, frameFade, frameH, frameScale, frameW, frameX, frameY, leftX, radius, restY, rightX, scrollYProgress])

  useEffect(() => {
    if (reduced || index === visualRef.current) return
    const target = index
    const fromSide = visualRef.current % 2 === 0 ? 'left' : 'right'
    const toSide = target % 2 === 0 ? 'left' : 'right'
    let cancelled = false
    const controls: Array<{ stop: () => void }> = []
    const tween = (value: typeof frameX, to: number, options: { duration?: number; ease?: [number, number, number, number]; type?: 'spring'; bounce?: number }) => {
      const animation = animate(value, to, options)
      controls.push(animation)
      return animation.finished.catch(() => undefined)
    }
    const run = async () => {
      swapLock.current = true
      hideText.current()
      copyGate.set(0)
      const { endWidth: width, endHeight: height, width: viewWidth, restY: ground, leftX: landLeft, rightX: landRight } = metrics.current
      const circle = Math.min(132, Math.min(width, height) * 0.36)
      const centerY = frameY.get() + frameH.get() / 2
      const exitX = fromSide === 'left' ? -circle - 72 : viewWidth + 72
      const leave = { type: 'spring' as const, duration: 0.24, bounce: 0.35 }
      await Promise.all([
        tween(frameW, circle, leave),
        tween(frameH, circle, leave),
        tween(radius, circle / 2, leave),
        tween(frameX, exitX, { type: 'spring', duration: 0.24, bounce: 0.28 }),
        tween(frameY, centerY - circle / 2, { type: 'spring', duration: 0.24, bounce: 0.3 }),
      ])
      if (cancelled) return
      frameFade.set(0)
      const landX = toSide === 'left' ? landLeft : landRight
      const entryX = toSide === 'right' ? viewWidth - circle * 0.2 : -circle * 0.8
      frameX.set(entryX)
      frameY.set(ground + height / 2 - circle / 2)
      frameW.set(circle)
      frameH.set(circle)
      radius.set(circle / 2)
      frameScale.set(1)
      visualRef.current = target
      setVisualIndex(target)
      setTextSide(toSide === 'left' ? 'right' : 'left')
      frameFade.set(1)
      await tween(frameX, landX + (width - circle) / 2, { type: 'spring', duration: 0.16, bounce: 0.35 })
      if (cancelled) return
      copyGate.set(1)
      revealText.current()
      await Promise.all([
        tween(frameX, landX, { type: 'spring', duration: 0.1, bounce: 0.2 }),
        tween(frameY, ground, { type: 'spring', duration: 0.1, bounce: 0.2 }),
        tween(frameW, width, { type: 'spring', duration: 0.1, bounce: 0.22 }),
        tween(frameH, height, { type: 'spring', duration: 0.1, bounce: 0.22 }),
        tween(radius, 0, { duration: 0.1, ease: [0.22, 1, 0.36, 1] }),
      ])
      if (cancelled) return
      swapLock.current = false
      onSwapDone.current()
    }
    void run()
    return () => {
      cancelled = true
      controls.forEach((animation) => animation.stop())
    }
  }, [copyGate, frameH, frameScale, frameW, frameX, frameY, index, radius, reduced])

  if (reduced) {
    return (
      <section className="bg-[#f6f1e7]" aria-labelledby="what-we-make-title">
        {list.map((item, itemIndex) => (
          <div key={`${item.href}-${item.title}`} className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-12">
            <Copy piece={item} step={itemIndex} labelled={itemIndex === 0} plain />
            <div className="mx-auto w-[min(760px,92vw)] bg-blue p-4 shadow-[0_24px_40px_-22px_rgba(0,48,72,0.45)]">
              <div className="relative aspect-[19/14] overflow-hidden ring-1 ring-gold/80">
                <SanityImage image={hasImage(item.image) ? item.image : fallbackImage} alt={item.title} sizes="760px" className="h-full w-full" />
              </div>
            </div>
          </div>
        ))}
      </section>
    )
  }

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-[#f6f1e7]" aria-labelledby="what-we-make-title">
      <div className="relative h-full">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-[#e6dccb]" />
        <motion.div
          className="absolute left-0 top-0 z-20 overflow-hidden bg-blue"
          style={{ width: frameW, height: frameH, x: frameX, y: frameY, scale: frameScale, borderRadius: radius, opacity: frameFade, transformOrigin: 'left top', boxShadow: shadow }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <SanityImage image={image} alt={piece.title} sizes="100vw" className="h-full w-full" />
            <motion.div aria-hidden className="pointer-events-none absolute inset-0 border-[16px] border-blue" style={{ opacity: ringOpacity }} />
            <motion.div aria-hidden className="pointer-events-none absolute inset-4 ring-1 ring-inset ring-gold" style={{ opacity: ringOpacity }} />
          </div>
        </motion.div>
        <motion.div
          style={{ opacity: copyOpacity }}
          className={`absolute z-30 max-w-md ${narrow ? 'bottom-14 right-[7%]' : textSide === 'right' ? 'top-1/2 right-[6%] max-w-sm -translate-y-1/2' : 'top-1/2 left-[6%] max-w-sm -translate-y-1/2'}`}
        >
          <motion.div style={{ x: textShift }}>
            <Copy piece={piece} step={active} labelled token={textToken} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Copy({ piece, step, labelled = false, token = 0, plain = false }: { piece: CraftPiece; step: number; labelled?: boolean; token?: number; plain?: boolean }) {
  const parts = [
    `ما نصنعه · ${String(step + 1).padStart(2, '0')}`,
    piece.title,
    piece.description,
    'تفاصيل هذه القطعة',
  ]
  const total = Math.max(parts.reduce((count, part) => count + Array.from(part).length, 0), 1)
  const fade = Math.min(0.05, 0.5 / total)
  const gap = total === 1 ? 0 : (0.5 - fade) / (total - 1)
  let cursor = 0
  const delays = parts.map((part) => {
    const start = cursor
    cursor += Array.from(part).length
    return start
  })
  return (
    <>
      <p className="text-sm font-semibold text-blue">
        <Letters text={parts[0]} token={token} plain={plain} fade={fade} gap={gap} delay={delays[0]} />
      </p>
      <h2 id={labelled ? 'what-we-make-title' : undefined} className="mt-3 font-display text-4xl leading-tight text-blue md:text-6xl">
        <span className="sr-only">{piece.title}</span>
        <Letters text={parts[1]} token={token} plain={plain} fade={fade} gap={gap} delay={delays[1]} />
      </h2>
      <p className="mt-4 text-lg leading-9 text-muted">
        <span className="sr-only">{piece.description}</span>
        <Letters text={parts[2]} token={token} plain={plain} fade={fade} gap={gap} delay={delays[2]} />
      </p>
      <Link to={piece.href} className="mt-6 inline-flex font-semibold text-blue underline decoration-gold decoration-2 underline-offset-8">
        <Letters text={parts[3]} token={token} plain={plain} fade={fade} gap={gap} delay={delays[3]} />
      </Link>
    </>
  )
}

function Letters({ text, token, plain, fade, gap, delay }: { text: string; token: number; plain: boolean; fade: number; gap: number; delay: number }) {
  if (plain) return text
  const chars = Array.from(text)
  return (
    <span aria-hidden>
      {chars.map((char, index) => (
        <span
          key={`${token}-${delay + index}`}
          className="sbeity-letter inline"
          style={
            token === 0
              ? { whiteSpace: 'pre-wrap', opacity: 0 }
              : { whiteSpace: 'pre-wrap', animation: `sbeity-letter ${fade}s linear ${(delay + index) * gap}s both` }
          }
        >
          {char}
        </span>
      ))}
    </span>
  )
}
