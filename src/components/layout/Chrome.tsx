import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { useSite } from '@/components/layout/SiteContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { whatsappHref } from '@/utils/whatsapp'

export function ScrollProgress() {
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 })
  if (reduced) return null
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-right bg-gold" aria-hidden />
}

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: 8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
          className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-blue text-white shadow-lift"
          aria-label="العودة إلى الأعلى"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export function WhatsAppButton() {
  const { settings, companyName } = useSite()
  const href = settings?.whatsapp ? whatsappHref(settings.whatsapp, `مرحباً ${companyName}، أود الاستفسار عن عمل حسب الطلب.`) : null
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="مراسلة واتساب"
      className="fixed bottom-5 left-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105"
    >
      <WhatsAppIcon />
    </a>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 13.95c-.24.68-1.4 1.3-1.94 1.38-.5.07-1.12.1-1.81-.11-.41-.13-.95-.31-1.63-.61-2.86-1.24-4.72-4.12-4.86-4.31-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.26.64-.38 1.02-.38.12 0 .23 0 .33.01.29.01.44.03.63.49.24.58.82 2 .89 2.15.07.14.12.32.02.51-.09.19-.14.31-.28.48-.14.16-.29.36-.41.48-.14.13-.28.28-.12.54.16.26.71 1.17 1.53 1.89 1.05.93 1.94 1.22 2.21 1.36.27.14.43.12.59-.07.16-.19.68-.79.86-1.06.18-.27.36-.22.6-.13.24.1 1.53.72 1.79.85.26.13.44.19.5.3.07.11.07.64-.17 1.32z" />
    </svg>
  )
}

export function CustomCursor() {
  const reduced = usePrefersReducedMotion()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(fine && !reduce)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return
    const dot = document.createElement('div')
    dot.className = 'cursor-dot'
    dot.setAttribute('aria-hidden', 'true')
    document.body.appendChild(dot)
    document.documentElement.classList.add('has-custom-cursor')
    let x = 0
    let y = 0
    let cx = 0
    let cy = 0
    let frame = 0
    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      dot.style.opacity = '1'
    }
    const onOver = (event: Event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      dot.dataset.hot = target.closest('a, button, input, textarea, select, summary, [data-cursor]') ? 'true' : 'false'
    }
    const loop = () => {
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
      dot.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      frame = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerover', onOver)
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      dot.remove()
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [enabled])

  return null
}
