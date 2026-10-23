import { cn } from '@/utils/cn'

export function Logo({ name, src, className, compact = false }: { name: string; src?: string | null; className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <img src={src || '/brand/logo.png'} alt="" className="h-11 w-11 object-contain" />
      {!compact && <span className="font-display text-[1.65rem] leading-none text-blue">{name}</span>}
    </span>
  )
}
