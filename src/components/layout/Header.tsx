import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { NavLink, Link, useLocation } from 'react-router'
import { navLinks } from '@/components/navigation/links'
import { useSite } from '@/components/layout/SiteContext'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { useLockBody } from '@/hooks/useLockBody'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/utils/cn'

export function Header() {
  const { companyName, logoUrl } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const reduced = usePrefersReducedMotion()
  useLockBody(open)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'relative z-50 border-b transition duration-300',
          scrolled || open ? 'border-line bg-white/92 shadow-sm backdrop-blur-md' : 'border-transparent bg-white/70',
        )}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-3 px-5 md:px-8 lg:px-12">
          <Link to="/" aria-label={companyName} className="relative z-50 min-w-0">
            <Logo name={companyName} src={logoUrl} />
          </Link>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="التنقل الرئيسي">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn('text-sm font-semibold text-blue/75 transition hover:text-blue', isActive && 'text-blue underline decoration-gold decoration-2 underline-offset-8')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden lg:block">
            <Button to="/contact">اطلب عرض سعر</Button>
          </div>
          <button
            type="button"
            className="relative z-50 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? 'إغلاق القائمة' : 'فتح القائمة'}</span>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            className="fixed inset-0 z-40 overflow-y-auto bg-white px-6 pt-28 pb-12 lg:hidden"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
          >
            <nav className="mx-auto flex w-full max-w-lg flex-col gap-1" aria-label="التنقل في الجوال">
              {navLinks.map((link, index) => (
                <motion.div key={link.to} initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : index * 0.05 }}>
                  <NavLink to={link.to} end={link.end} className="block py-2 font-display text-3xl text-blue sm:text-4xl" onClick={() => setOpen(false)}>
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="mx-auto mt-8 w-full max-w-lg">
              <Button to="/contact" size="lg">
                اطلب عرض سعر
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
