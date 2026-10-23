import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { Reveal } from '@/components/animations/Reveal'
import { useSite } from '@/components/layout/SiteContext'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Seo } from '@/components/seo/Seo'
import { Container } from '@/components/ui/Container'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { useAsync } from '@/hooks/useAsync'
import { getCategories, getProjects } from '@/lib/sanity/fetchers'
import { normalizeSearch } from '@/utils/filters'

export function OurWorkPage() {
  const { companyName } = useSite()
  const [params, setParams] = useSearchParams()
  const state = useAsync(() => Promise.all([getProjects(), getCategories()]), [])
  const category = params.get('category') || 'all'
  const query = params.get('q') || ''
  const projects = state.data?.[0].projects ?? []
  const categories = state.data?.[1].categories ?? []

  const visible = useMemo(() => {
    const needle = normalizeSearch(query)
    return projects.filter((project) => {
      if (category !== 'all' && project.category?.slug !== category) return false
      if (!needle) return true
      const haystack = normalizeSearch([project.title, project.summary, project.client, project.category?.title].filter(Boolean).join(' '))
      return haystack.includes(needle)
    })
  }, [projects, category, query])

  function update(next: { category?: string; q?: string }) {
    const updated = new URLSearchParams()
    const categoryValue = next.category ?? category
    const q = next.q ?? query
    if (categoryValue !== 'all') updated.set('category', categoryValue)
    if (q.trim()) updated.set('q', q.trim())
    setParams(updated, { replace: true })
  }

  return (
    <div className="mt-20 md:grid md:grid-cols-6">
      <Seo title={`أعمالنا | ${companyName}`} description="مشاريع منفذة في الطباعة، اللافتات، والأخشاب." path="/our-work" />
      <aside className="border-b border-line bg-white md:sticky md:top-20 md:z-20 md:col-span-1 md:h-[calc(100dvh-5rem)] md:self-start md:overflow-hidden md:border-b-0 md:border-e">
        <div className="flex flex-col gap-2 p-4" role="toolbar" aria-label="تصفية حسب التصنيف">
          <Chip active={category === 'all'} onClick={() => update({ category: 'all' })}>الكل</Chip>
          {categories.map((item) => (
            <Chip key={item._id} active={category === item.slug} onClick={() => update({ category: item.slug })}>
              {item.title}
            </Chip>
          ))}
        </div>
      </aside>
      <section className="md:col-span-5">
        <Container className="py-8">
          <Reveal from="right">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <h1 className="font-display text-2xl leading-none text-blue md:text-3xl">أعمال خرجت إلى المكان</h1>
              <div>
                <label className="sr-only" htmlFor="project-search">بحث في الأعمال</label>
                <input id="project-search" value={query} onChange={(event) => update({ q: event.target.value })} placeholder="ابحثوا في الأعمال" className="min-h-10 rounded-full border border-line px-4 text-sm md:w-64" />
              </div>
            </div>
          </Reveal>
          {state.status === 'loading' && <div className="aspect-[16/8] animate-pulse rounded-[1.8rem] bg-foam" />}
          {state.status === 'error' && <ErrorState onRetry={() => window.location.reload()} />}
          {state.status === 'success' && visible.length === 0 && (
            <EmptyState title="لا توجد أعمال مطابقة" text="أضيفوا المشاريع من لوحة التحكم، أو غيّروا التصفية." action={{ to: '/studio', label: 'لوحة التحكم' }} />
          )}
          {state.status === 'success' && visible.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              {visible.map((project, index) => (
                <Reveal key={project._id} from={index % 2 === 0 ? 'up' : 'left'} className={index === 0 ? 'md:col-span-2' : undefined}>
                  <ProjectCard project={project} large={index === 0} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  )
}

function Chip({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={`min-h-10 w-full rounded-full px-3 py-2 text-sm font-semibold leading-5 ${active ? 'bg-blue text-white' : 'bg-mist text-blue'}`}>
      {children}
    </button>
  )
}
