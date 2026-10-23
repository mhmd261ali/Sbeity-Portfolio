import { describe, expect, it } from 'vitest'
import type { ProductCard } from '@/types/content'
import { filterProducts, normalizeSearch, parseSort } from '@/utils/filters'

const products: ProductCard[] = [
  { _id: '1', title: 'لوحة خشبية', slug: 'wood', _createdAt: '2024-01-01', category: { title: 'أخشاب', slug: 'wood' }, shortDescription: 'اسم محفور' },
  { _id: '2', title: 'كانفس جداري', slug: 'canvas', _createdAt: '2025-05-01', category: { title: 'كانفس', slug: 'canvas' } },
  { _id: '3', title: 'بانر المحل', slug: 'banner', _createdAt: '2023-03-01', category: { title: 'بانرات', slug: 'banners' } },
]

describe('product filters', () => {
  it('normalizes Arabic letter variants', () => {
    expect(normalizeSearch('آلة')).toBe('اله')
  })

  it('filters by category and search', () => {
    const result = filterProducts(products, { category: 'wood', query: 'محفور', sort: 'newest' })
    expect(result.map((item) => item.slug)).toEqual(['wood'])
  })

  it('sorts alphabetically and by date', () => {
    expect(parseSort('nope')).toBe('newest')
    expect(filterProducts(products, { sort: 'oldest' }).map((item) => item.slug)).toEqual(['banner', 'wood', 'canvas'])
    expect(filterProducts(products, { sort: 'alpha' }).map((item) => item.slug)[0]).toBe('banner')
  })
})
