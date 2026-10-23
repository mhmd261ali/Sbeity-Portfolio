import { defineField, defineType } from 'sanity'
import { iconOptions, imageField, slugField } from './shared'

export const service = defineType({
  name: 'service',
  title: 'خدمة',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'اسم الخدمة',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    slugField(),
    defineField({
      name: 'description',
      title: 'الوصف',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(400),
    }),
    imageField('image', 'صورة الخدمة'),
    defineField({
      name: 'icon',
      title: 'الأيقونة',
      type: 'string',
      options: { list: iconOptions, layout: 'radio' },
      initialValue: 'shapes',
    }),
    defineField({
      name: 'category',
      title: 'تصنيف المنتجات المرتبط',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'زر الخدمة يفتح المنتجات ضمن هذا التصنيف.',
    }),
    defineField({
      name: 'displayOrder',
      title: 'ترتيب العرض',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  orderings: [{ title: 'ترتيب العرض', name: 'displayOrder', by: [{ field: 'displayOrder', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'description', media: 'image' },
  },
})
