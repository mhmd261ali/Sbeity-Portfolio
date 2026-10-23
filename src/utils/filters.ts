import type { ProductCard } from '@/types/content'

export type SortKey = 'newest' | 'oldest' | 'alpha'

export function normalizeSearch(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
}

export function parseSort(value: string | null): SortKey {
  if (value === 'oldest' || value === 'alpha') return value
  return 'newest'
}

export function filterProducts(
  products: ProductCard[],
  options: { category?: string; query?: string; sort?: SortKey },
) {
  const category = options.category && options.category !== 'all' ? options.category : ''
  const query = normalizeSearch(options.query ?? '')

  const filtered = products.filter((product) => {
    if (category && product.category?.slug !== category) return false
    if (!query) return true
    const haystack = normalizeSearch(
      [product.title, product.shortDescription, product.category?.title].filter(Boolean).join(' '),
    )
    return haystack.includes(query)
  })

  const sorted = [...filtered]
  const sort = options.sort ?? 'newest'

  if (sort === 'alpha') {
    sorted.sort((a, b) => a.title.localeCompare(b.title, 'ar'))
  } else if (sort === 'oldest') {
    sorted.sort((a, b) => createdTime(a) - createdTime(b))
  } else {
    sorted.sort((a, b) => createdTime(b) - createdTime(a))
  }

  return sorted
}

function createdTime(product: ProductCard) {
  const time = product._createdAt ? new Date(product._createdAt).getTime() : 0
  return Number.isNaN(time) ? 0 : time
}
