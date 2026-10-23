import { Reveal } from '@/components/animations/Reveal'
import { SanityImage } from '@/components/galleries/SanityImage'
import { useSite } from '@/components/layout/SiteContext'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { defaults } from '@/content/defaults'
import { useAsync } from '@/hooks/useAsync'
import { getAboutPage, getHomepage } from '@/lib/sanity/fetchers'

export function AboutPage() {
  const site = useSite()
  const state = useAsync(() => Promise.all([getAboutPage(), getHomepage()]), [])
  const page = state.data?.[0]?.page
  const homepage = state.data?.[1]?.page
  const whyItems = homepage?.whyItems?.length ? homepage.whyItems : defaults.whyItems

  return (
    <div className="pb-24 pt-28 md:pt-36">
      <Seo title={`${page?.title || 'من نحن'} | ${site.companyName}`} description={page?.introduction || site.description} path="/about" />

      {state.status === 'error' && (
        <Container className="mt-12">
          <ErrorState onRetry={() => window.location.reload()} />
        </Container>
      )}
      {state.status === 'success' && !page && (
        <Container className="mt-12">
          <EmptyState title="صفحة من نحن بانتظار النص" text="حرّروا قصة الشركة من لوحة التحكم، ثم انشروها." action={{ to: '/studio', label: 'تحرير الصفحة' }} />
        </Container>
      )}

      {page && (
        <>
          {page.mission && (
            <Reveal from="right">
            <section aria-labelledby="mission-heading">
              <Container>
                <div className={`grid items-center gap-10 ${page.images?.[0] ? 'lg:grid-cols-2 lg:gap-16' : ''}`}>
                  <div>
                    <p className="flex items-center gap-3 text-sm font-semibold text-blue">
                      <span className="h-px w-8 bg-gold" aria-hidden />
                      الرسالة
                    </p>
                    <h2 id="mission-heading" className="mt-5 max-w-xl font-display text-3xl leading-relaxed text-blue md:text-5xl">{page.mission}</h2>
                  </div>
                  {page.images?.[0] && (
                    <div className="overflow-hidden rounded-[1.8rem] lg:col-start-2">
                      <div className="aspect-[4/3] lg:aspect-[5/4]">
                        <SanityImage image={page.images[0]} sizes="(min-width: 1024px) 46vw, 100vw" priority />
                      </div>
                    </div>
                  )}
                </div>
              </Container>
            </section>
            </Reveal>
          )}

          {!!page.values?.length && (
            <Reveal>
            <Container className="mt-20">
              <h2 className="font-display text-4xl text-blue">ما نتمسك به</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {page.values.map((value, index) => (
                  <article key={value._key || value.title} className="h-full rounded-[1.6rem] border border-line p-6">
                    <span className="font-display text-3xl text-gold">0{index + 1}</span>
                    <h3 className="mt-3 font-display text-2xl">{value.title}</h3>
                    <p className="mt-2 leading-8 text-muted">{value.description}</p>
                  </article>
                ))}
              </div>
            </Container>
            </Reveal>
          )}

          {!!page.processSteps?.length && (
            <Reveal from="left">
            <Container className="mt-20">
              <h2 className="font-display text-4xl text-blue">من الفكرة إلى التسليم</h2>
              <ol className="mt-8 grid gap-4 md:grid-cols-4">
                {page.processSteps.map((step, index) => (
                  <li key={step._key || step.title} className="rounded-[1.5rem] border border-line p-5">
                    <span className="font-display text-3xl text-gold">0{index + 1}</span>
                    <h3 className="mt-3 font-display text-xl">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{step.description}</p>
                  </li>
                ))}
              </ol>
            </Container>
            </Reveal>
          )}
        </>
      )}

      <section className="mt-20 border-y border-line py-20 md:py-28">
        <Container>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4 md:sticky md:top-28 md:self-start">
              <Reveal from="up">
                <SectionHeading eyebrow={site.companyName} title="لماذا تُنجَز القطعة هنا" />
              </Reveal>
            </div>
            <ol className="md:col-span-8">
              {whyItems.map((item, index) => (
                <Reveal key={item._key || item.title} as="li" from={index % 2 === 0 ? 'left' : 'up'} className="grid grid-cols-[auto_1fr] gap-5 border-t border-line py-7">
                  <span className="font-display text-3xl text-blue">0{index + 1}</span>
                  <div>
                    <h3 className="font-display text-2xl text-blue">{item.title}</h3>
                    <p className="mt-2 leading-8 text-muted">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <Reveal from="down">
      <Container className="mt-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-blue px-8 py-12 text-white md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-4xl">{defaults.ctaTitle}</h2>
            <p className="mt-3 max-w-xl text-white/75">{defaults.ctaText}</p>
          </div>
          <Button to="/contact" size="lg">لنصنعها معاً</Button>
        </div>
      </Container>
      </Reveal>
    </div>
  )
}
