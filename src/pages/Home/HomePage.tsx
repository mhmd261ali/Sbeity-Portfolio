import { useEffect, useRef, useState } from 'react'
import { Hourglass, Lightbulb, Users, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Reveal } from '@/components/animations/Reveal'
import { SplitHeadline } from '@/components/animations/SplitHeadline'
import LightPillar from '@/components/home/LightPillar'
import PatternWaves from '@/components/home/PatternWaves'
import { WhatWeMake, type CraftPiece } from '@/components/home/WhatWeMake'
import { useSite } from '@/components/layout/SiteContext'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Seo, siteOrigin } from '@/components/seo/Seo'
import { motion } from 'motion/react'
import { HeroVisual, useHeroMotion } from '@/components/three/HeroVisual'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { defaults } from '@/content/defaults'
import { useAsync } from '@/hooks/useAsync'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { imageUrl } from '@/lib/sanity/image'
import { getHomepage, getProjects, pickFeaturedProjects } from '@/lib/sanity/fetchers'
import { MorphingText } from '@/registry/magicui/morphing-text'
import { Highlighter } from '@/registry/magicui/highlighter'
import { cn } from '@/utils/cn'

export function HomePage() {
  const site = useSite()
  const state = useAsync(
    () => Promise.all([getHomepage(), getProjects()]),
    [],
  )

  const heroRef = useRef<HTMLElement>(null)
  const heroMotion = useHeroMotion(heroRef)

  const title = site.settings?.seoTitle || `${site.companyName} | ${site.tagline}`
  const origin = siteOrigin()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.companyName,
    description: site.description,
    url: origin,
    image: imageUrl(site.settings?.ogImage, 1200) || `${origin}/brand/logo.png`,
    email: site.settings?.email,
    telephone: site.settings?.phone,
    address: site.settings?.address,
  }

  if (state.status === 'error') {
    return (
      <Container className="pt-32">
        <ErrorState onRetry={() => window.location.reload()} />
      </Container>
    )
  }

  const [home, projects] = state.data ?? []
  const page = home?.page
  const heroTitle = page?.heroTitle || defaults.heroTitle
  const featuredProjects = pickFeaturedProjects(page ?? null, projects?.projects ?? [])

  return (
    <>
      <Seo title={title} description={site.description} path="/" image={imageUrl(site.settings?.ogImage || page?.heroImages?.[0], 1200) || undefined} jsonLd={jsonLd} />
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden [contain:paint]" aria-hidden>
          <LightPillar
            topColor="#FFF3C4"
            bottomColor="#F8E7A0"
            intensity={1}
            glowAmount={0.002}
            bloom={0.5}
            pillarWidth={3}
            pillarHeight={0.4}
            pillarRotation={25}
            rotationSpeed={0.3}
            shift={0.72}
            interactive
            clickPulse
            intro
            quality="medium"
            lightMode
            mixBlendMode="normal"
            className="pointer-events-none"
          />
        </div>
      <section ref={heroRef} className="relative z-10 isolate overflow-hidden pt-28 md:pt-32">
        <Container className="relative z-10">
          <Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-6">
            <motion.div style={{ x: heroMotion.textX, y: heroMotion.textY }}>
                <p className="flex items-center gap-3 text-sm font-semibold text-blue">
                  <span className="h-px w-8 bg-gold" aria-hidden />
                  {page?.eyebrow || defaults.heroEyebrow}
                </p>
                <SplitHeadline text={(heroTitle.split('\n')[0] || 'أفكاركم').replace(/[.]+$/u, '').trim()} className="mt-5 font-display text-[clamp(2.7rem,6vw,5.6rem)] leading-[1.18] text-blue" />
                <MorphingText
                  texts={['حرفتنا', 'ابداعنا', 'فننا']}
                  className="mt-1 h-[1.4em] font-display text-[clamp(3.2rem,7.2vw,6.6rem)] font-extrabold text-start text-blue"
                />
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button to="/our-work" size="lg">
                    استكشفوا أعمالنا
                  </Button>
                  <Button to="/contact" variant="line" size="lg">
                    تواصلوا معنا
                  </Button>
                </div>
            </motion.div>
            <div className="relative z-10 h-[460px] sm:h-[540px] lg:h-[640px]">
              <HeroVisual images={page?.heroImages} motion={heroMotion} />
            </div>
          </div>
          </Reveal>
        </Container>
      </section>

      <Proof />
      </div>

      <WhatWeMake pieces={homeServices} />

      <section className="relative isolate overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <PatternWaves
            preset="silk"
            color="#F8E7A0"
            scale={2}
            backgroundColor="transparent"
            contrast={2.2}
            depth={1.35}
            fade="edges"
            interactive
            cursorSize={50}
            cursorStrength={0.6}
          />
        </div>
        <Container className="relative">
          <Reveal from="right">
            <SectionHeading eyebrow="أعمال منفذة" title="قطع خرجت من الورشة إلى المكان" action={<Button to="/our-work" variant="line">كل الأعمال</Button>} />
          </Reveal>
          <div className="mt-12 space-y-8">
            {state.status === 'loading' ? null : featuredProjects.length ? featuredProjects.map((project, index) => (
              <Reveal key={project._id} from={index % 2 === 0 ? 'up' : 'left'}>
                <div className={cn('grid items-center gap-6 md:grid-cols-12', index % 2 === 1 && 'md:[&>*:first-child]:order-2')}>
                  <div className="md:col-span-7">
                    <ProjectCard project={project} large />
                  </div>
                  <div className="md:col-span-5 md:px-6">
                    <p className="text-sm font-semibold text-gold-deep">0{index + 1}</p>
                    <h3 className="mt-3 font-display text-4xl text-blue">{project.title}</h3>
                    <p className="mt-4 leading-8 text-muted">{project.summary || 'عمل مكتمل يمكن تصفحه بالصور والتفاصيل.'}</p>
                    <Link to={`/our-work/${project.slug}`} className="mt-5 inline-flex font-semibold text-blue underline decoration-gold decoration-2 underline-offset-8">
                      قصة المشروع
                    </Link>
                  </div>
                </div>
              </Reveal>
            )) : <EmptyState title="الأعمال ستُعرض هنا" text="المشاريع المنفذة تُدار بشكل مستقل عن المنتجات." action={{ to: '/studio', label: 'إضافة مشروع' }} />}
          </div>
        </Container>
      </section>

      <section className="pb-20 md:pb-28">
        <Reveal from="down">
        <Container>
          <div className="overflow-hidden rounded-[2rem] bg-blue px-6 py-16 text-white md:px-14 md:py-20">
            <p className="text-sm font-semibold text-gold">الخطوة التالية</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight md:text-6xl">{page?.ctaTitle || defaults.ctaTitle}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/75">{page?.ctaText || defaults.ctaText}</p>
            <div className="mt-8">
              <Button to="/contact" size="lg">لنصنعها معاً</Button>
            </div>
          </div>
        </Container>
        </Reveal>
      </section>
    </>
  )
}

const proof: { value: number; label: string; icon: LucideIcon }[] = [
  { value: 40, label: 'سنوات الخبرة', icon: Hourglass },
  { value: 1000, label: 'عدد العملاء', icon: Users },
  { value: 10000, label: 'عدد الأفكار', icon: Lightbulb },
]

function Proof() {
  return (
    <section className="relative z-10 mt-16 pb-16 md:mt-20 md:pb-24" aria-labelledby="proof-heading">
      <Reveal from="left">
      <Container>
        <h2 id="proof-heading" className="mx-auto mb-10 max-w-4xl text-center font-display text-3xl leading-relaxed text-blue md:mb-14 md:text-5xl">
          مهمتنا{' '}
          <Highlighter action="underline" color="#FF9800" isView strokeWidth={3}>
            تجسيد امالكم
          </Highlighter>{' '}
          في حرفة{' '}
          <Highlighter action="highlight" color="#87CEFA" isView>
            تليق بمشاعركم
          </Highlighter>
        </h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {proof.map((item) => (
            <li key={item.label} className="rounded-[1.6rem] border border-line bg-white/75 px-6 py-8 md:px-8 md:py-10">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foam text-blue" aria-hidden>
                <item.icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </span>
              <p className="mt-6 text-end font-display text-5xl leading-none text-blue md:text-6xl" dir="ltr" aria-label={`${item.value}+`}>
                <CountUp to={item.value} />
              </p>
              <span className="mt-5 block h-1 w-10 bg-gold" aria-hidden />
              <p className="mt-4 text-lg font-semibold text-blue">{item.label}</p>
            </li>
          ))}
        </ul>
      </Container>
      </Reveal>
    </section>
  )
}

function CountUp({ to }: { to: number }) {
  const reduced = usePrefersReducedMotion()
  const [value, setValue] = useState(reduced ? to : 0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduced) {
      setValue(to)
      return
    }
    const node = ref.current
    if (!node) return
    let frame = 0
    let started = false
    const run = () => {
      if (started) return
      const rect = node.getBoundingClientRect()
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return
      started = true
      const start = performance.now()
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / 2000)
        const eased = 1 - (1 - progress) ** 3
        setValue(Math.round(to * eased))
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        run()
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    run()
    window.addEventListener('scroll', run, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', run)
      cancelAnimationFrame(frame)
    }
  }, [reduced, to])

  return (
    <span ref={ref} aria-hidden>
      {value}+
    </span>
  )
}

const homeServices: CraftPiece[] = [
  {
    title: 'البانرات',
    description: 'لافتات كبيرة للمحال والمعارض والمناسبات، تُقرأ من بعيد وتتحمّل مكان العرض.',
    href: '/products',
    image: { alt: 'بانر مطبوع', src: '/templates/fabric.jpg' },
  },
  {
    title: 'أحرف ثلاثية الأبعاد',
    description: 'حروف بارزة تُركَّب على الواجهة، فيظهر الاسم قبل أن يصل الزائر إلى الباب.',
    href: '/products',
    image: { alt: 'أحرف ثلاثية الأبعاد', src: '/templates/wood.jpg' },
  },
  {
    title: 'الفينيل',
    description: 'قص ولصق على الزجاج والجدران والسيارات، بشكل نظيف يثبت على السطح.',
    href: '/products',
    image: { alt: 'فينيل ملون', src: '/templates/color.jpg' },
  },
  {
    title: 'الشعارات',
    description: 'نصمّم الشعار ونجهّزه للطباعة والتركيب، حتى يبقى واضحاً على كل قطعة.',
    href: '/products',
    image: { alt: 'تصميم شعار', src: '/templates/desk.jpg' },
  },
  {
    title: 'ديكور اللامايكا',
    description: 'تغطية الجدران والواجهات بألواح لامايكا مزخرفة، بمقاس يناسب المكان.',
    href: '/products',
    image: { alt: 'ديكور لامايكا', src: '/templates/interior.jpg' },
  },
  {
    title: 'نيون ليد',
    description: 'إضاءة نيون حديثة للمحال والديكور الداخلي، تُبرز الاسم بعد المغيب.',
    href: '/products',
    image: { alt: 'إضاءة نيون', src: '/templates/store.jpg' },
  },
]


