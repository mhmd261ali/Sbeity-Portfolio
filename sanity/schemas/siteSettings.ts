import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageField, socialPlatforms } from './shared'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'إعدادات الموقع',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: 'اسم الشركة',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    imageField('logo', 'الشعار'),
    imageField('favicon', 'أيقونة المتصفح'),
    defineField({
      name: 'tagline',
      title: 'السطر التعريفي',
      type: 'string',
      validation: (Rule) => Rule.max(140),
    }),
    defineField({
      name: 'description',
      title: 'نبذة قصيرة',
      type: 'text',
      rows: 4,
      description: 'تُستخدم أيضاً كوصف افتراضي لمحركات البحث.',
      validation: (Rule) => Rule.max(320),
    }),
    defineField({
      name: 'email',
      title: 'البريد الإلكتروني',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'الهاتف',
      type: 'string',
    }),
    defineField({
      name: 'whatsapp',
      title: 'رقم واتساب',
      type: 'string',
      description: 'بصيغة دولية، مثل 96170000000. يمكن كتابة الرقم مع + أو مسافات.',
    }),
    defineField({
      name: 'address',
      title: 'العنوان',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'رابط خرائط غوغل',
      type: 'url',
      description: 'اختياري. إذا تُرك فارغاً يُبنى الرابط من العنوان.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'حسابات التواصل',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'المنصة',
              type: 'string',
              options: { list: socialPlatforms },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'الرابط',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        }),
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'عنوان الصفحة الرئيسية في البحث',
      type: 'string',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'وصف البحث',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(180),
    }),
    imageField('ogImage', 'صورة المشاركة'),
  ],
  preview: {
    select: { title: 'companyName', media: 'logo' },
    prepare({ title, media }) {
      return { title: title || 'إعدادات الموقع', media }
    },
  },
})
