import { defineField } from 'sanity'

export const iconOptions = [
  { title: 'إطار لوحة', value: 'frame' },
  { title: 'علم / بانر', value: 'flag' },
  { title: 'خشب', value: 'tree' },
  { title: 'لافتة', value: 'sign' },
  { title: 'هدية', value: 'gift' },
  { title: 'ألوان', value: 'palette' },
  { title: 'لمعة', value: 'sparkles' },
  { title: 'قلم', value: 'pen' },
  { title: 'طبقات', value: 'layers' },
  { title: 'ختم', value: 'stamp' },
  { title: 'طباعة', value: 'printer' },
  { title: 'أشكال', value: 'shapes' },
]

export const socialPlatforms = [
  { title: 'إنستغرام', value: 'instagram' },
  { title: 'فيسبوك', value: 'facebook' },
  { title: 'تيك توك', value: 'tiktok' },
  { title: 'لينكدإن', value: 'linkedin' },
  { title: 'بينترست', value: 'pinterest' },
  { title: 'يوتيوب', value: 'youtube' },
  { title: 'إكس', value: 'x' },
  { title: 'أخرى', value: 'other' },
]

type SlugValue = { current?: string } | undefined

type SlugContext = {
  document?: { _id?: string; _type?: string }
  getClient: (options: { apiVersion: string }) => {
    fetch: <T>(query: string, params: Record<string, unknown>) => Promise<T>
  }
}

export async function uniqueSlug(slug: SlugValue, context: SlugContext) {
  const current = slug?.current
  const id = context.document?._id?.replace(/^drafts\./, '')
  const type = context.document?._type
  if (!current || !id || !type) return true

  const client = context.getClient({ apiVersion: '2026-10-22' })
  const count = await client.fetch<number>(
    `count(*[_type == $type && slug.current == $slug && !(_id in [$id, $draft])])`,
    { type, slug: current, id, draft: `drafts.${id}` },
  )

  return count === 0 || 'هذا الرابط مستخدم مسبقاً'
}

export function altField(required = false) {
  return defineField({
    name: 'alt',
    title: 'النص البديل',
    type: 'string',
    description: 'صف الصورة بجملة قصيرة. تظهر لقارئ الشاشة وتساعد في البحث.',
    validation: required ? (Rule) => Rule.required().max(180) : (Rule) => Rule.max(180),
  })
}

export function imageField(name: string, title: string, required = false) {
  return defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [altField(required)],
    validation: required ? (Rule) => Rule.required() : undefined,
  })
}

export function slugField() {
  return defineField({
    name: 'slug',
    title: 'الرابط',
    type: 'slug',
    description: 'يُنشأ من الاسم عبر زر Generate. الرابط الإنجليزي أسهل في المشاركة، ويمكن استخدام العربي.',
    options: { source: 'title', maxLength: 96 },
    validation: (Rule) =>
      Rule.required().custom(async (value, context) => uniqueSlug(value as SlugValue, context as SlugContext)),
  })
}
