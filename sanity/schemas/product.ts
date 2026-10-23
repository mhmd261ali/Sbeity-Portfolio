import { defineArrayMember, defineField, defineType } from 'sanity'
import { altField, imageField, slugField } from './shared'

export const product = defineType({
  name: 'product',
  title: 'منتج',
  type: 'document',
  description:
    'قطعة يمكن للشركة تنفيذها. بعد الحفظ اضغط Publish ليظهر المنتج في الموقع. هذا الموقع للعرض وطلب عروض الأسعار فقط، ولا يوجد حقل سعر.',
  groups: [
    { name: 'content', title: 'المحتوى', default: true },
    { name: 'media', title: 'الصور' },
    { name: 'options', title: 'خيارات التنفيذ' },
    { name: 'display', title: 'العرض' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'اسم المنتج',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().max(120),
    }),
    { ...slugField(), group: 'content' },
    defineField({
      name: 'category',
      title: 'التصنيف',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'وصف قصير',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'يظهر على البطاقة. جملة أو جملتان.',
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: 'description',
      title: 'الوصف الكامل',
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
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [altField(true)],
        }),
      ],
    }),
    { ...imageField('mainImage', 'الصورة الرئيسية', true), group: 'media' },
    defineField({
      name: 'gallery',
      title: 'صور إضافية',
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
    defineField({
      name: 'materials',
      title: 'الخامات المتاحة',
      type: 'array',
      group: 'options',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'sizes',
      title: 'المقاسات المتاحة',
      type: 'array',
      group: 'options',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'customizationOptions',
      title: 'خيارات التخصيص',
      type: 'array',
      group: 'options',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      description: 'مثل الاسم، اللون، الشعار، أو عبارة الإهداء.',
    }),
    defineField({
      name: 'featured',
      title: 'منتج مختار',
      type: 'boolean',
      group: 'display',
      description: 'يظهر في الصفحة الرئيسية إذا لم تُحدَّد منتجات يدوياً هناك.',
      initialValue: false,
    }),
    defineField({
      name: 'displayOrder',
      title: 'ترتيب العرض',
      type: 'number',
      group: 'display',
      description: 'الرقم الأصغر يظهر أولاً داخل التصنيف.',
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  orderings: [
    { title: 'ترتيب العرض', name: 'displayOrder', by: [{ field: 'displayOrder', direction: 'asc' }] },
    { title: 'الأحدث', name: 'createdDesc', by: [{ field: '_createdAt', direction: 'desc' }] },
    { title: 'الاسم', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      media: 'mainImage',
      featured: 'featured',
    },
    prepare({ title, category, media, featured }) {
      return {
        title,
        subtitle: [featured ? 'مختار' : null, category].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
