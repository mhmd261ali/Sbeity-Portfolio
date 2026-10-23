import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/utils/cn'

export function SplitHeadline({
  text,
  as: Tag = 'h1',
  className,
}: {
  text: string
  as?: 'h1' | 'h2'
  className?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const words = ref.current?.querySelectorAll<HTMLElement>('[data-word]')
    if (!words?.length) return
    if (reduced) {
      words.forEach((word) => {
        word.style.opacity = '1'
        word.style.transform = 'none'
      })
      return
    }

    const animation = animate(words, {
      opacity: [0, 1],
      translateY: ['0.7em', '0em'],
      delay: stagger(90),
      duration: 900,
      ease: 'outExpo',
    })

    return () => {
      animation.revert()
    }
  }, [text, reduced])

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <Tag ref={ref} className={cn(className)}>
      {lines.map((line, lineIndex) => (
        <span key={`${line}-${lineIndex}`} className="block">
          {line.split(/\s+/).map((word, wordIndex) => (
            <span key={`${word}-${wordIndex}`} data-word className="word-reveal">
              {word}{' '}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
