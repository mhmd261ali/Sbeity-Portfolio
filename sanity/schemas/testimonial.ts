import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'رأي عميل',
  type: 'document',
  fields: [
    defineField({
      name: 'customerName',
      title: 'اسم العميل',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'role',
      title: 'الصفة',
      type: 'string',
      description: 'مثل: صاحبة مقهى، أو عريس وعروس.',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'content',
      title: 'الرأي',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required().min(12).max(600),
    }),
    defineField({
      name: 'rating',
      title: 'التقييم',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.required().integer().min(1).max(5),
    }),
    defineField({
      name: 'featured',
      title: 'إظهار في الصفحة الرئيسية',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'customerName', subtitle: 'content', featured: 'featured' },
    prepare({ title, subtitle, featured }) {
      return { title: featured ? title : `${title} (مخفي)`, subtitle }
    },
  },
})
