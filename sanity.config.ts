import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/desk'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || ''
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const SINGLETONS = new Set(['siteSettings', 'homepage', 'aboutPage'])

export default defineConfig({
  name: 'sbeity',
  title: 'استوديو سبيتي',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    templates: (previous) => previous.filter((template) => !SINGLETONS.has(template.schemaType)),
  },
  document: {
    newDocumentOptions: (previous, { creationContext }) => {
      if (creationContext.type === 'global') {
        return previous.filter((item) => !SINGLETONS.has(item.templateId))
      }
      return previous
    },
  },
})
