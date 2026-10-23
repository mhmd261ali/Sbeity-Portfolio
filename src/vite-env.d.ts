/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SANITY_PROJECT_ID: string
  readonly VITE_SANITY_DATASET: string
  readonly VITE_SANITY_API_VERSION: string
  readonly VITE_SITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const process: {
  env: {
    SANITY_STUDIO_PROJECT_ID?: string
    SANITY_STUDIO_DATASET?: string
  }
}
