import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12', className)}>{children}</div>
}
