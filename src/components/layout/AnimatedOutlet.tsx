import { Suspense, useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function PageFallback() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 pt-32 md:px-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">جارٍ تحميل الصفحة</span>
      <div className="h-4 w-28 animate-pulse rounded-full bg-foam" />
      <div className="mt-6 h-16 w-2/3 max-w-xl animate-pulse rounded-2xl bg-foam" />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="aspect-[4/5] animate-pulse rounded-[1.7rem] bg-foam" />
        <div className="aspect-[4/5] animate-pulse rounded-[1.7rem] bg-foam" />
        <div className="aspect-[4/5] animate-pulse rounded-[1.7rem] bg-foam" />
      </div>
    </div>
  )
}

export function AnimatedOutlet() {
  const location = useLocation()
  const outlet = useOutlet()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  const quietLoad = location.pathname === '/' || location.pathname === '/about' || location.pathname === '/contact'

  return (
    <Suspense fallback={quietLoad ? null : <PageFallback />}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </Suspense>
  )
}
