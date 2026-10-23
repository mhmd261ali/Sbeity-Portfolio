import { defineArrayMember, defineField, defineType } from 'sanity'
import { altField, imageField, slugField } from './shared'

export const project = defineType({
  name: 'project',
  title: 'مشروع',
  type: 'document',
  description: 'عمل مكتمل تم تنفيذه لعميل أو لمساحة حقيقية. المشاريع منفصلة عن المنتجات.',
  groups: [
    { name: 'content', title: 'المحتوى', default: true },
    { name: 'media', title: 'الصور' },
    { name: 'details', title: 'التفاصيل' },
    { name: 'display', title: 'العرض' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'اسم المشروع',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().max(140),
    }),
    { ...slugField(), group: 'content' },
    defineField({
      name: 'summary',
      title: 'ملخص البطاقة',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'description',
      title: 'قصة المشروع',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'نص', value: 'normal' },
            { title: 'عنوان', value: 'h2' },
            { title: 'عنوان فرعي', value: 'h3' },
            { title: 'اقتباس', value: 'blockquote' },
          ],
          lists: [
            { title: 'نقاط', value: 'bullet' },
            { title: 'أرقام', value: 'number' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'التصنيف',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'content',
    }),
    { ...imageField('coverImage', 'صورة الغلاف', true), group: 'media' },
    defineField({
      name: 'images',
      title: 'معرض الصور',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [altField(false)],
        }),
      ],
    }),
    { ...imageField('beforeImage', 'صورة قبل التنفيذ'), group: 'media' },
    { ...imageField('afterImage', 'صورة بعد التنفيذ'), group: 'media' },
    defineField({
      name: 'client',
      title: 'العميل',
      type: 'string',
      group: 'details',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'year',
      title: 'سنة الإنجاز',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.integer().min(1990).max(2100),
    }),
    defineField({
      name: 'services',
      title: 'الخدمات المقدمة',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'materials',
      title: 'الخامات المستخدمة',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'featured',
      title: 'مشروع مختار',
      type: 'boolean',
      group: 'display',
      initialValue: false,
    }),
    defineField({
      name: 'displayOrder',
      title: 'ترتيب العرض',
      type: 'number',
      group: 'display',
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  orderings: [
    { title: 'ترتيب العرض', name: 'displayOrder', by: [{ field: 'displayOrder', direction: 'asc' }] },
    { title: 'الأحدث', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', client: 'client', year: 'year', media: 'coverImage' },
    prepare({ title, client, year, media }) {
      return { title, subtitle: [client, year].filter(Boolean).join(' · '), media }
    },
  },
})
