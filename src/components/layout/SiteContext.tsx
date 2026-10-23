import { createContext, useContext, type ReactNode } from 'react'
import { defaults } from '@/content/defaults'
import { useAsync } from '@/hooks/useAsync'
import { imageUrl } from '@/lib/sanity/image'
import { getSiteSettings } from '@/lib/sanity/fetchers'
import type { SiteSettings } from '@/types/content'

type SiteContextValue = {
  settings: SiteSettings | null
  configured: boolean
  loading: boolean
  companyName: string
  tagline: string
  description: string
  logoUrl: string | null
}

const SiteContext = createContext<SiteContextValue | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const state = useAsync(() => getSiteSettings(), [])
  const settings = state.data?.settings ?? null
  const value: SiteContextValue = {
    settings,
    configured: state.data?.configured ?? false,
    loading: state.status === 'loading',
    companyName: settings?.companyName || defaults.companyName,
    tagline: settings?.tagline || defaults.tagline,
    description: settings?.seoDescription || settings?.description || defaults.description,
    logoUrl: imageUrl(settings?.logo, 160),
  }

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const value = useContext(SiteContext)
  if (!value) throw new Error('useSite must be used within SiteProvider')
  return value
}
