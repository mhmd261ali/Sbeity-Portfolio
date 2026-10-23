import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/utils/cn'

export type EnterFrom = 'up' | 'down' | 'left' | 'right'

const distance = 28

function shift(from: EnterFrom) {
  if (from === 'left') return { x: -distance, y: 0 }
  if (from === 'right') return { x: distance, y: 0 }
  if (from === 'down') return { x: 0, y: -distance }
  return { x: 0, y: distance }
}

function useEntered<T extends Element>() {
  const ref = useRef<T>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setEntered(true)
        observer.disconnect()
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, entered }
}

export function Reveal({
  children,
  className,
  delay = 0,
  from = 'up',
  as = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  from?: EnterFrom
  as?: 'div' | 'li'
}) {
  const reduced = usePrefersReducedMotion()
  const { ref, entered } = useEntered<HTMLDivElement & HTMLLIElement>()
  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  const start = shift(from)
  const MotionTag = as === 'li' ? motion.li : motion.div

  return (
    <MotionTag
      ref={ref}
      className={cn(className)}
      initial={false}
      animate={entered ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: start.x, y: start.y }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
