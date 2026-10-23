import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/utils/cn'

const variants = {
  gold: 'bg-gold text-blue hover:bg-gold-deep',
  blue: 'bg-blue text-white hover:bg-blue-deep',
  ghost: 'bg-transparent text-blue hover:bg-mist',
  line: 'border border-blue/15 bg-white text-blue hover:border-blue',
}

const sizes = {
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-12 px-6 text-base',
}

type Props = {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  className?: string
  children: ReactNode
  to?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export function Button({ variant = 'gold', size = 'md', className, children, to, type = 'button', ...props }: Props) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  )

  if (to) {
    const external = /^(https?:|mailto:|tel:)/.test(to)
    if (external) {
      return (
        <a href={to} className={classes} target={to.startsWith('http') ? '_blank' : undefined} rel={to.startsWith('http') ? 'noreferrer' : undefined}>
          {children}
        </a>
      )
    }
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
