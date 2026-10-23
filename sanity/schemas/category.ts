import { defineField, defineType } from 'sanity'
import { imageField, slugField } from './shared'

export const category = defineType({
  name: 'category',
  title: 'تصنيف',
  type: 'document',
  description: 'تصنيفات المنتجات والأعمال. لا يمكن حذف تصنيف ما دام مرتبطاً بمنتج أو مشروع.',
  fields: [
    defineField({
      name: 'title',
      title: 'اسم التصنيف',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    slugField(),
    defineField({
      name: 'description',
      title: 'وصف قصير',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(280),
    }),
    imageField('image', 'صورة التصنيف'),
    defineField({
      name: 'displayOrder',
      title: 'ترتيب العرض',
      type: 'number',
      description: 'الرقم الأصغر يظهر أولاً.',
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  orderings: [
    { title: 'ترتيب العرض', name: 'displayOrder', by: [{ field: 'displayOrder', direction: 'asc' }] },
    { title: 'الاسم', name: 'title', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'description', media: 'image' },
  },
})
