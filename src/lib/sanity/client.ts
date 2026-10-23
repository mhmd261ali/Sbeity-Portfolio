import { createClient, type SanityClient } from '@sanity/client'

export const sanityConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2026-10-22',
}

export function isSanityConfigured() {
  return Boolean(sanityConfig.projectId && sanityConfig.dataset)
}

export const client: SanityClient | null = isSanityConfigured()
  ? createClient({
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      useCdn: false,
      perspective: 'published',
    })
  : null

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}) {
  if (!client) {
    throw new Error('Sanity is not configured')
  }

  return client.fetch<T>(query, params)
}
