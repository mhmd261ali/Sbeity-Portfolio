import type { StructureResolver } from 'sanity/structure'

const HIDDEN = new Set(['siteSettings', 'homepage', 'aboutPage', 'product', 'category', 'project', 'service', 'testimonial'])

function singleton(S: Parameters<StructureResolver>[0], type: string, title: string) {
  return S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title))
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('محتوى سبيتي')
    .items([
      singleton(S, 'homepage', 'الصفحة الرئيسية'),
      singleton(S, 'aboutPage', 'من نحن'),
      singleton(S, 'siteSettings', 'إعدادات الموقع'),
      S.divider(),
      S.documentTypeListItem('product').title('المنتجات'),
      S.documentTypeListItem('category').title('التصنيفات'),
      S.documentTypeListItem('project').title('الأعمال'),
      S.documentTypeListItem('service').title('الخدمات'),
      S.documentTypeListItem('testimonial').title('آراء العملاء'),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        return Boolean(id && !HIDDEN.has(id))
      }),
    ])
