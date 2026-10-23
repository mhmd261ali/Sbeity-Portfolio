import { defineArrayMember, defineField, defineType } from 'sanity'

const titledText = [
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
    validation: (Rule) => Rule.required().max(320),
  }),
]

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'من نحن',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'سطر صغير',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'title',
      title: 'العنوان',
      type: 'string',
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: 'introduction',
      title: 'المقدمة',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'companyStory',
      title: 'قصة الشركة',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'نص', value: 'normal' },
            { title: 'عنوان', value: 'h2' },
            { title: 'اقتباس', value: 'blockquote' },
          ],
          lists: [{ title: 'نقاط', value: 'bullet' }],
        }),
      ],
    }),
    defineField({
      name: 'mission',
      title: 'الرسالة',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'values',
      title: 'القيم',
      type: 'array',
      of: [defineArrayMember({ type: 'object', fields: titledText })],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'expertise',
      title: 'الخبرات',
      type: 'array',
      of: [defineArrayMember({ type: 'object', fields: titledText })],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'materialsText',
      title: 'الخامات والحرفة',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.max(600),
    }),
    defineField({
      name: 'processSteps',
      title: 'خطوات العمل في صفحة من نحن',
      type: 'array',
      of: [defineArrayMember({ type: 'object', fields: titledText })],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'images',
      title: 'صور من وراء العمل',
      type: 'array',
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
    }),
  ],
  preview: {
    prepare() {
      return { title: 'من نحن' }
    },
  },
})
