import { useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSearchParams } from 'react-router'
import { Reveal } from '@/components/animations/Reveal'
import { ProductCard } from '@/components/products/ProductCard'
import { Seo } from '@/components/seo/Seo'
import { useSite } from '@/components/layout/SiteContext'
import { Container } from '@/components/ui/Container'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { useAsync } from '@/hooks/useAsync'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { getCategories, getProducts } from '@/lib/sanity/fetchers'
import { filterProducts, parseSort, type SortKey } from '@/utils/filters'

export function ProductsPage() {
  const { companyName } = useSite()
  const [params, setParams] = useSearchParams()
  const reduced = usePrefersReducedMotion()
  const state = useAsync(() => Promise.all([getProducts(), getCategories()]), [])
  const category = params.get('category') || 'all'
  const query = params.get('q') || ''
  const sort = parseSort(params.get('sort'))

  const products = state.data?.[0].products ?? []
  const categories = state.data?.[1].categories ?? []
  const visible = useMemo(
    () => filterProducts(products, { category, query, sort }),
    [products, category, query, sort],
  )

  function update(next: { category?: string; q?: string; sort?: SortKey }) {
    const categoryValue = next.category ?? category
    const q = next.q ?? query
    const sortValue = next.sort ?? sort
    const updated = new URLSearchParams()
    if (categoryValue && categoryValue !== 'all') updated.set('category', categoryValue)
    if (q.trim()) updated.set('q', q.trim())
    if (sortValue !== 'newest') updated.set('sort', sortValue)
    setParams(updated, { replace: true })
  }

  return (
    <div className="mt-20 md:grid md:grid-cols-6">
      <Seo title={`المنتجات | ${companyName}`} description="تصفحوا منتجات الطباعة والتصميم حسب الطلب، ثم اطلبوا عرض سعر." path="/products" />
      <aside className="border-b border-line bg-white md:sticky md:top-20 md:z-20 md:col-span-1 md:h-[calc(100dvh-5rem)] md:self-start md:overflow-hidden md:border-b-0 md:border-e">
        <div className="flex flex-col gap-2 p-4" role="toolbar" aria-label="تصفية حسب التصنيف">
          <FilterChip active={category === 'all'} onClick={() => update({ category: 'all' })}>
            الكل
          </FilterChip>
          {categories.map((item) => (
            <FilterChip key={item._id} active={category === item.slug} onClick={() => update({ category: item.slug })}>
              {item.title}
            </FilterChip>
          ))}
        </div>
      </aside>

      <section className="md:col-span-5">
        <Container className="py-8">
          <Reveal>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <h1 className="font-display text-2xl leading-none text-blue md:text-3xl">منتجات تُصنع لكم</h1>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="sr-only" htmlFor="product-search">البحث عن منتج</label>
                <input
                  id="product-search"
                  value={query}
                  onChange={(event) => update({ q: event.target.value })}
                  placeholder="ابحثوا بالاسم"
                  className="min-h-10 rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-blue"
                />
                <label className="sr-only" htmlFor="product-sort">الترتيب</label>
                <select
                  id="product-sort"
                  value={sort}
                  onChange={(event) => update({ sort: parseSort(event.target.value) })}
                  className="min-h-10 rounded-full border border-line bg-white px-4 text-sm"
                >
                  <option value="newest">الأحدث</option>
                  <option value="oldest">الأقدم</option>
                  <option value="alpha">أبجدياً</option>
                </select>
              </div>
            </div>
          </Reveal>
          {state.status === 'loading' && <SkeletonGrid />}
          {state.status === 'error' && <ErrorState onRetry={() => window.location.reload()} />}
          {state.status === 'success' && visible.length === 0 && (
            <EmptyState
              title="لا توجد نتائج"
              text={products.length ? 'جرّبوا تصنيفاً آخر أو عبارة بحث أقصر.' : 'اربطوا Sanity وانشروا المنتجات ليظهر الكتالوج.'}
              action={{ to: '/studio', label: 'لوحة التحكم' }}
            />
          )}
          {state.status === 'success' && visible.length > 0 && (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visible.map((product, index) => (
                  <motion.div
                    key={product._id}
                    layout
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <Reveal from={index % 2 === 0 ? 'up' : 'left'}>
                      <ProductCard product={product} imageClassName="aspect-[4/5]" />
                    </Reveal>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </Container>
      </section>
    </div>
  )
}

function FilterChip({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-10 w-full rounded-full px-3 py-2 text-sm font-semibold leading-5 ${active ? 'bg-blue text-white' : 'bg-mist text-blue hover:bg-foam'}`}
    >
      {children}
    </button>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="aspect-[4/5] animate-pulse rounded-[1.7rem] bg-foam" />
      ))}
    </div>
  )
}
