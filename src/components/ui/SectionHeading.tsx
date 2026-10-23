import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function SectionHeading({
  eyebrow,
  title,
  text,
  action,
  light = false,
  className,
}: {
  eyebrow?: string
  title: string
  text?: string
  action?: ReactNode
  light?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className={cn('mb-3 flex items-center gap-3 text-sm font-semibold', light ? 'text-gold' : 'text-blue')}>
            <span className="h-px w-8 bg-gold" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h2 className={cn('font-display text-4xl leading-tight md:text-5xl', light ? 'text-white' : 'text-blue')}>{title}</h2>
        {text && <p className={cn('mt-4 text-lg leading-8', light ? 'text-white/75' : 'text-muted')}>{text}</p>}
      </div>
      {action}
    </div>
  )
}
