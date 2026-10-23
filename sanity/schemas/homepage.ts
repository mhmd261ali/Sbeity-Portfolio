import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageField } from './shared'

const stepFields = [
  defineField({
    name: 'title',
    title: 'العنوان',
    type: 'string',
    validation: (Rule) => Rule.required().max(80),
  }),
  defineField({
    name: 'description',
    title: 'الوصف',
    type: 'text',
    rows: 3,
    validation: (Rule) => Rule.required().max(280),
  }),
]

export const homepage = defineType({
  name: 'homepage',
  title: 'الصفحة الرئيسية',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'سطر صغير فوق العنوان',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'heroTitle',
      title: 'عنوان الواجهة',
      type: 'text',
      rows: 4,
      description: 'يمكن استخدام أسطر متعددة. كل سطر يظهر بحجم كبير.',
      validation: (Rule) => Rule.required().max(180),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'وصف الواجهة',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(360),
    }),
    defineField({
      name: 'heroImages',
      title: 'صور الواجهة',
      type: 'array',
      description: 'حتى ثلاث صور تظهر أسفل العنوان بجانب المشهد ثلاثي الأبعاد.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'النص البديل',
              type: 'string',
              validation: (Rule) => Rule.required().max(180),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'featuredProducts',
      title: 'منتجات الصفحة الرئيسية',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      description: 'إذا تُرك فارغاً تُعرض المنتجات المعلَّمة كمختارة.',
      validation: (Rule) => Rule.max(8).unique(),
    }),
    defineField({
      name: 'featuredProjects',
      title: 'مشاريع الصفحة الرئيسية',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
      description: 'إذا تُرك فارغاً تُعرض المشاريع المعلَّمة كمختارة.',
      validation: (Rule) => Rule.max(4).unique(),
    }),
    defineField({
      name: 'whyItems',
      title: 'لماذا نحن',
      type: 'array',
      of: [defineArrayMember({ type: 'object', fields: stepFields })],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'processSteps',
      title: 'خطوات العمل',
      type: 'array',
      of: [defineArrayMember({ type: 'object', fields: stepFields })],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'ctaTitle',
      title: 'عنوان الدعوة الأخيرة',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'ctaText',
      title: 'نص الدعوة الأخيرة',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(240),
    }),
    imageField('ctaImage', 'صورة الدعوة'),
  ],
  preview: {
    prepare() {
      return { title: 'الصفحة الرئيسية' }
    },
  },
})
