import { Link } from 'react-router'
import { SanityImage } from '@/components/galleries/SanityImage'
import type { ProductCard as ProductCardData } from '@/types/content'
import { cn } from '@/utils/cn'

export function ProductCard({
  product,
  className,
  imageClassName,
  sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw',
}: {
  product: ProductCardData
  className?: string
  imageClassName?: string
  sizes?: string
}) {
  return (
    <article className={cn('group', className)}>
      <Link to={`/products/${product.slug}`} className="block rounded-[1.7rem] focus-visible:outline-offset-8" data-cursor="view">
        <div className={cn('relative overflow-hidden rounded-[1.7rem] bg-foam', imageClassName)}>
          <SanityImage
            image={product.mainImage}
            sizes={sizes}
            className="transition duration-700 ease-out group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-blue/0 transition duration-500 group-hover:bg-blue/30 group-focus-within:bg-blue/30" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between p-5 text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <span className="text-sm font-semibold">عرض التفاصيل</span>
          </div>
          <div className="absolute right-4 top-4 flex flex-wrap gap-2">
            {product.category?.title && (
              <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue">{product.category.title}</span>
            )}
          </div>
          {product.featured && (
            <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-blue">مختار</span>
          )}
        </div>
        <h3 className="mt-4 font-display text-2xl leading-snug text-blue">{product.title}</h3>
        {product.shortDescription && <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted">{product.shortDescription}</p>}
      </Link>
    </article>
  )
}
