import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { categories, photos, products, projects, services, testimonials, type PhotoKey } from './seed-data'
import { loadEnvFiles } from './loadEnv'

loadEnvFiles()

const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || ''
const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN || ''
const refreshImages = process.argv.includes('--images')

if (!projectId || !token) {
  console.error('أضيفوا VITE_SANITY_PROJECT_ID و SANITY_WRITE_TOKEN إلى ملف .env.local ثم أعيدوا المحاولة.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-10-22',
  token,
  useCdn: false,
})

const cache = new Map<string, string>()

async function uploadPhoto(key: PhotoKey) {
  const url = photos[key]
  const cached = cache.get(url)
  if (cached) return cached
  const assetId = await uploadBuffer(url, key).catch(async () => uploadBuffer(`https://picsum.photos/seed/sbeity-${key}/1400/1000`, key))
  cache.set(url, assetId)
  return assetId
}

async function uploadBuffer(url: string, name: string) {
  const response = await fetch(url, { redirect: 'follow', headers: { Accept: 'image/*', 'User-Agent': 'SbeityPortfolioSeed/1.0' } })
  if (!response.ok) throw new Error(`${response.status} ${url}`)
  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const buffer = Buffer.from(await response.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, { filename: `${name}.jpg`, contentType })
  return asset._id
}

function image(assetId: string, alt: string) {
  return { _type: 'image', alt, asset: { _type: 'reference', _ref: assetId } }
}

function ref(id: string) {
  return { _type: 'reference', _ref: id }
}

function blocks(paragraphs: string[]) {
  return paragraphs.map((text, index) => ({
    _type: 'block',
    _key: `p${index}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `s${index}`, text, marks: [] }],
  }))
}

async function keepOrCreate(id: string, doc: Record<string, unknown>, imageKeys: string[]) {
  const existing = (await client.getDocument(id)) as Record<string, unknown> | undefined
  if (existing && !refreshImages) {
    for (const key of imageKeys) {
      if (existing[key]) doc[key] = existing[key]
    }
  }
  await client.createOrReplace({ _type: 'document', ...doc, _id: id } as { _id: string; _type: string })
}

async function run() {
  console.log('زرع المحتوى في', projectId, dataset)
  const logoAsset = await uploadPhoto('frames').catch(() => '')
  const logoFile = logoAsset
    ? image(logoAsset, 'شعار سبيتي')
    : undefined
  const localLogo = readFileSync(new URL('../public/brand/logo.png', import.meta.url))
  const brandAsset = await client.assets.upload('image', localLogo, { filename: 'logo.png', contentType: 'image/png' })

  for (const category of categories) {
    const assetId = await uploadPhoto(category.photo).catch(() => '')
    await keepOrCreate(
      category.id,
      {
        _type: 'category',
        title: category.title,
        slug: { _type: 'slug', current: category.slug },
        description: category.description,
        displayOrder: category.order,
        ...(assetId ? { image: image(assetId, category.title) } : {}),
      },
      ['image'],
    )
  }

  for (const item of products) {
    const main = await uploadPhoto(item.photo).catch(() => '')
    const gallery = []
    for (const key of item.gallery) {
      const assetId = await uploadPhoto(key).catch(() => '')
      if (assetId) gallery.push({ ...image(assetId, item.title), _key: key })
    }
    await keepOrCreate(
      item.id,
      {
        _type: 'product',
        title: item.title,
        slug: { _type: 'slug', current: item.slug },
        category: ref(item.category),
        shortDescription: item.short,
        description: blocks(item.story),
        ...(main ? { mainImage: image(main, item.title) } : {}),
        gallery,
        materials: item.materials,
        sizes: item.sizes,
        customizationOptions: item.options,
        featured: item.featured,
        displayOrder: item.order,
      },
      ['mainImage', 'gallery'],
    )
  }

  for (const item of services) {
    const assetId = await uploadPhoto(item.photo).catch(() => '')
    await keepOrCreate(
      item.id,
      {
        _type: 'service',
        title: item.title,
        slug: { _type: 'slug', current: item.slug },
        description: item.description,
        icon: item.icon,
        category: ref(item.category),
        displayOrder: item.order,
        ...(assetId ? { image: image(assetId, item.title) } : {}),
      },
      ['image'],
    )
  }

  for (const item of projects) {
    const cover = await uploadPhoto(item.cover).catch(() => '')
    const images = []
    for (const key of item.gallery) {
      const assetId = await uploadPhoto(key).catch(() => '')
      if (assetId) images.push({ ...image(assetId, item.title), _key: key })
    }
    const extra = item as typeof item & { before?: PhotoKey; after?: PhotoKey }
    const before = extra.before ? await uploadPhoto(extra.before).catch(() => '') : ''
    const after = extra.after ? await uploadPhoto(extra.after).catch(() => '') : ''
    await keepOrCreate(
      item.id,
      {
        _type: 'project',
        title: item.title,
        slug: { _type: 'slug', current: item.slug },
        summary: item.summary,
        description: blocks(item.story),
        category: ref(item.category),
        client: item.client,
        year: item.year,
        services: item.services,
        materials: item.materials,
        featured: item.featured,
        displayOrder: item.order,
        ...(cover ? { coverImage: image(cover, item.title) } : {}),
        images,
        ...(before ? { beforeImage: image(before, `${item.title} قبل التنفيذ`) } : {}),
        ...(after ? { afterImage: image(after, `${item.title} بعد التنفيذ`) } : {}),
      },
      ['coverImage', 'images', 'beforeImage', 'afterImage'],
    )
  }

  for (const item of testimonials) {
    await client.createOrReplace({
      _id: item.id,
      _type: 'testimonial',
      customerName: item.name,
      role: item.role,
      content: item.content,
      rating: item.rating,
      featured: true,
    })
  }

  const heroKeys: PhotoKey[] = ['canvas', 'wood', 'interior']
  const heroImages = []
  for (const key of heroKeys) {
    const assetId = await uploadPhoto(key).catch(() => '')
    if (assetId) heroImages.push({ ...image(assetId, 'عمل من استوديو سبيتي'), _key: key })
  }

  await keepOrCreate(
    'homepage',
    {
      _type: 'homepage',
      eyebrow: 'استوديو الطباعة والتصميم حسب الطلب',
      heroTitle: 'أفكاركم.\nحرفتنا.\nنتائج استثنائية.',
      heroSubtitle: 'من لوحة الكانفس إلى اللافتة الخشبية، نصنع كل قطعة بعناية تليق بفكرتكم.',
      heroImages,
      featuredProducts: products.filter((item) => item.featured).map((item) => ({ ...ref(item.id), _key: item.id })),
      featuredProjects: projects.map((item) => ({ ...ref(item.id), _key: item.id })),
      whyItems: [
        { _key: 'w1', _type: 'object', title: 'تصاميم حسب الطلب', description: 'لا نبدأ من قالب جاهز. النص والمقاس واللون تُضبط على المكان.' },
        { _key: 'w2', _type: 'object', title: 'خامات مختارة', description: 'خشب، قماش، أكريليك، وفنيل نختار منها ما يناسب الداخل أو الواجهة.' },
        { _key: 'w3', _type: 'object', title: 'عناية بالتفاصيل', description: 'الهوامش، والتثبيت، ووضوح الخط تُراجع قبل أن تخرج القطعة.' },
        { _key: 'w4', _type: 'object', title: 'طباعة احترافية', description: 'ألوان ثابتة ومقاسات كبيرة من غير أن تبهت الصورة عن قرب.' },
        { _key: 'w5', _type: 'object', title: 'خدمة شخصية', description: 'تتحدثون مع من ينفّذ، لا مع سلة شراء. نوضّح الخطوة التالية قبل العمل.' },
        { _key: 'w6', _type: 'object', title: 'حرفة تُرى', description: 'القطعة يجب أن تُعلَّق أو تُهدى وهي تشبه صاحبها.' },
      ],
      processSteps: [
        { _key: 's1', _type: 'object', title: 'شاركونا الفكرة', description: 'صورة، مقاس تقريبي، ومكان التعليق يكفون للبداية.' },
        { _key: 's2', _type: 'object', title: 'نصمّم ونجهّز', description: 'نقترح الخامة والتكوين، ونثبت النص قبل الطباعة.' },
        { _key: 's3', _type: 'object', title: 'نصنع', description: 'نطبع أو نحفر، ثم نراجع الحواف والألوان.' },
        { _key: 's4', _type: 'object', title: 'التسليم', description: 'تستلمون قطعة جاهزة للتعليق أو للإهداء.' },
      ],
      ctaTitle: 'هل لديكم فكرة مميزة؟',
      ctaText: 'صفوها لنا كما تتخيلونها. نعود إليكم بطريقة تنفيذ واضحة.',
    },
    ['heroImages', 'ctaImage'],
  )

  await keepOrCreate(
    'aboutPage',
    {
      _type: 'aboutPage',
      eyebrow: 'الاستوديو',
      title: 'نصنع ما يُعلَّق ويُهدى',
      introduction: 'سبيتي استوديو للطباعة والتصميم حسب الطلب. نعمل مع من يريد قطعة تشبهه: لوحة في البيت، لافتة للمحل، أو هدية تُحفظ.',
      companyStory: blocks([
        'بدأ العمل من طاولة ضيقة وطلبات بسيطة: اسم على خشب، وصورة على قماش. مع الوقت صارت الطلبات واجهات محال ومجموعات زفاف وجدراناً كاملة.',
        'ما لم يتغير هو الطريقة. نسأل عن المكان قبل أن نسأل عن المقاس، ونرفض أن تخرج القطعة لامعة إذا كان الجدار هادئاً.',
      ]),
      mission: 'نحوّل الفكرة إلى قطعة ملموسة، واضحة، ومتقنة، من غير أن نُغرق صاحبها في تعقيد التنفيذ.',
      values: [
        { _key: 'v1', _type: 'object', title: 'الوضوح', description: 'نعرف ماذا سنصنع قبل أن نبدأ، ونقوله بلغة مفهومة.' },
        { _key: 'v2', _type: 'object', title: 'العناية', description: 'الحافة والخط والمسافة ليست تفاصيل صغيرة.' },
        { _key: 'v3', _type: 'object', title: 'أمانة الخامة', description: 'نقترح الخامة التي تعيش في المكان، لا الأرخص ولا الأثقل دائماً.' },
        { _key: 'v4', _type: 'object', title: 'احترام الفكرة', description: 'صاحب الطلب يبقى صاحب القطعة. نحن نُحسن تنفيذها.' },
      ],
      expertise: [
        { _key: 'e1', _type: 'object', title: 'الكانفس والجدار', description: 'صور ومجموعات تُعلَّق بإيقاع واحد.' },
        { _key: 'e2', _type: 'object', title: 'الطباعة الكبيرة', description: 'بانرات وواجهات تُقرأ من مسافة.' },
        { _key: 'e3', _type: 'object', title: 'الخشب', description: 'أسماء وهدايا ولافتات محفورة أو مطبوعة.' },
        { _key: 'e4', _type: 'object', title: 'اللافتات المكتبية', description: 'تعريف هادئ للمكاتب والاستقبال.' },
      ],
      materialsText: 'نعمل على القماش، والخشب الطبيعي، والأكريليك، وألواح الطباعة. نختار التشطيب حسب مكان العرض: بيت، محل، مناسبة، أو مكتب.',
      processSteps: [
        { _key: 'p1', _type: 'object', title: 'الفكرة', description: 'نستمع للمكان والنص والمناسبة.' },
        { _key: 'p2', _type: 'object', title: 'التصور', description: 'نقترح التكوين والخامة.' },
        { _key: 'p3', _type: 'object', title: 'التنفيذ', description: 'نطبع أو نحفر ونراجع.' },
        { _key: 'p4', _type: 'object', title: 'التسليم', description: 'القطعة تخرج جاهزة.' },
      ],
      images: heroImages,
    },
    ['images'],
  )

  await keepOrCreate(
    'siteSettings',
    {
      _type: 'siteSettings',
      companyName: 'سبيتي',
      tagline: 'نصنع ما يُعلَّق، ويُهدى، ويُرى',
      description: 'استوديو سبيتي للطباعة والتصميم حسب الطلب. لوحات كانفس، لافتات، أخشاب، ومطبوعات تُصنع بعناية.',
      email: 'hello@sbeity.example',
      phone: '+961 70 000 000',
      whatsapp: '96170000000',
      address: 'بيروت، لبنان',
      seoTitle: 'سبيتي | الطباعة الإبداعية والتصميم حسب الطلب',
      seoDescription: 'كانفس، لافتات، أخشاب، وهدايا مطبوعة حسب الطلب من استوديو سبيتي.',
      logo: image(brandAsset._id, 'شعار سبيتي'),
      favicon: image(brandAsset._id, 'أيقونة سبيتي'),
      ...(logoFile ? { ogImage: logoFile } : {}),
      socialLinks: [],
    },
    ['logo', 'favicon', 'ogImage'],
  )

  console.log('اكتمل الزرع. المستندات كُتبت بمعرّفات منشورة وتظهر في الموقع بعد التحديث.')
}

run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
