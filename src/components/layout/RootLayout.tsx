import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { AnimatedOutlet } from '@/components/layout/AnimatedOutlet'
import { BackToTop, CustomCursor, ScrollProgress, WhatsAppButton } from '@/components/layout/Chrome'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { IntroVideo } from '@/components/layout/IntroVideo'
import { SiteProvider } from '@/components/layout/SiteContext'

const INTRO_KEY = 'sbeity-intro-seen'

export function RootLayout() {
  const { pathname } = useLocation()
  const [phase, setPhase] = useState<'checking' | 'intro' | 'site'>('checking')

  useEffect(() => {
    const seen = sessionStorage.getItem(INTRO_KEY) === '1'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setPhase(seen || reduced ? 'site' : 'intro')
  }, [])

  if (phase === 'checking') return <div className="min-h-dvh bg-white" />
  if (phase === 'intro') {
    return (
      <IntroVideo
        onDone={() => {
          sessionStorage.setItem(INTRO_KEY, '1')
          setPhase('site')
        }}
      />
    )
  }

  return (
    <SiteProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[75] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-blue">
        تخطي إلى المحتوى
      </a>
      <ScrollProgress />
      <Header />
      <main id="main" tabIndex={-1} className={pathname === '/contact' ? 'outline-none' : 'min-h-screen outline-none'}>
        <AnimatedOutlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <CustomCursor />
    </SiteProvider>
  )
}

export function RouteError() {
  return (
    <div className="grid min-h-screen place-items-center bg-white px-6 text-center text-blue">
      <div>
        <p className="text-sm font-semibold text-gold-deep">حدث خطأ</p>
        <h1 className="mt-3 font-display text-5xl">تعذر عرض هذه الصفحة</h1>
        <Link to="/" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-gold px-5 font-semibold">
          العودة إلى الرئيسية
        </Link>
      </div>
    </div>
  )
}
