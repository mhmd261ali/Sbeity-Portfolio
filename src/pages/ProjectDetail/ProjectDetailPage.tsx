import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { Reveal } from '@/components/animations/Reveal'
import { RichText } from '@/components/content/RichText'
import { Lightbox } from '@/components/galleries/Lightbox'
import { SanityImage } from '@/components/galleries/SanityImage'
import { useSite } from '@/components/layout/SiteContext'
import { BeforeAfter } from '@/components/projects/BeforeAfter'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { useAsync } from '@/hooks/useAsync'
import { hasImage, imageUrl } from '@/lib/sanity/image'
import { getProject } from '@/lib/sanity/fetchers'
import type { SanityImage as SanityImageData } from '@/types/content'

export function ProjectDetailPage() {
  const { slug = '' } = useParams()
  const site = useSite()
  const state = useAsync(() => getProject(slug), [slug])
  const [open, setOpen] = useState<number | null>(null)
  const project = state.data?.project
  const images = project
    ? [project.coverImage, ...(project.images ?? [])].filter((image): image is NonNullable<SanityImageData> => hasImage(image))
    : []

  if (state.status === 'loading') {
    return <div className="h-[70vh] animate-pulse bg-foam" />
  }
  if (state.status === 'error') {
    return (
      <Container className="pt-32">
        <ErrorState onRetry={() => window.location.reload()} />
      </Container>
    )
  }
  if (!project) {
    return (
      <Container className="pt-32">
        <EmptyState title="المشروع غير متاح" text="ربما لم يُنشر بعد." action={{ to: '/our-work', label: 'كل الأعمال' }} />
      </Container>
    )
  }

  const facts = [
    project.client ? { label: 'العميل', value: project.client } : null,
    project.year ? { label: 'السنة', value: String(project.year) } : null,
    project.category?.title ? { label: 'التصنيف', value: project.category.title } : null,
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact))

  return (
    <article className="pb-24">
      <Seo
        title={`${project.title} | ${site.companyName}`}
        description={project.summary || site.description}
        path={`/our-work/${project.slug}`}
        image={imageUrl(project.coverImage, 1600) || undefined}
        type="article"
      />
      <header className="relative min-h-[70vh] bg-blue text-white">
        <div className="absolute inset-0">
          <SanityImage image={project.coverImage} priority sizes="100vw" className="opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue via-blue/30 to-blue/10" />
        </div>
        <Container className="relative flex min-h-[70vh] flex-col justify-end py-16">
          <Reveal>
          <nav className="text-sm text-white/80" aria-label="مسار التنقل">
            <Link to="/" className="hover:text-white">الرئيسية</Link>
            <span className="px-2">/</span>
            <Link to="/our-work" className="hover:text-white">أعمالنا</Link>
          </nav>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-tight md:text-7xl">{project.title}</h1>
          {project.summary && <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">{project.summary}</p>}
          </Reveal>
        </Container>
      </header>
      <Container className="mt-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="h-fit rounded-[1.6rem] border border-line p-6 lg:sticky lg:top-28">
          <Reveal from="right">
          <dl className="space-y-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-sm text-muted">{fact.label}</dt>
                <dd className="font-display text-2xl text-blue">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <TagList title="الخدمات" items={project.services} />
          <TagList title="الخامات" items={project.materials} />
          <div className="mt-6">
            <Button to="/contact">اطلبوا عملاً مشابهاً</Button>
          </div>
          </Reveal>
        </aside>
        <Reveal from="left">
        <div>
          <RichText value={project.description} />
          <BeforeAfter before={project.beforeImage} after={project.afterImage} />
          {images.length > 0 && (
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {images.map((image, index) => (
                <button key={image.asset?._id || index} type="button" className={`overflow-hidden rounded-[1.5rem] text-right ${index === 0 ? 'md:col-span-2' : ''}`} onClick={() => setOpen(index)}>
                  <div className={index === 0 ? 'aspect-[16/9]' : 'aspect-[4/5]'}>
                    <SanityImage image={image} sizes={index === 0 ? '100vw' : '45vw'} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        </Reveal>
      </Container>
      {!!project.related?.length && (
        <Reveal>
        <Container className="mt-20">
          <h2 className="font-display text-4xl text-blue">أعمال قريبة</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {project.related.map((item) => (
              <ProjectCard key={item._id} project={item} />
            ))}
          </div>
        </Container>
        </Reveal>
      )}
      {open !== null && (
        <Lightbox images={images} index={open} onClose={() => setOpen(null)} onStep={(delta) => setOpen((value) => (value === null ? 0 : (value + delta + images.length) % images.length))} />
      )}
    </article>
  )
}

function TagList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null
  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold text-blue">{title}</h2>
      <ul className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-full bg-mist px-3 py-1 text-sm">{item}</li>
        ))}
      </ul>
    </div>
  )
}
