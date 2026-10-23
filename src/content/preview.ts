import type { PortableTextBlock } from '@portabletext/types'
import type {
  AboutPage,
  Category,
  Homepage,
  ProductCard,
  ProductDetail,
  ProjectCard,
  ProjectDetail,
  Service,
  SiteSettings,
  Testimonial,
} from '@/types/content'

// Local stand-in photography used only while Sanity is not connected.
// Published Sanity documents replace this catalog entirely.

type Photo = 'canvas' | 'paint' | 'frames' | 'wood' | 'workshop' | 'wedding' | 'office' | 'store' | 'interior' | 'desk' | 'fabric' | 'gallery' | 'living' | 'writing' | 'color'

function photo(name: Photo, alt: string) {
  return { alt, src: `/templates/${name}.jpg` }
}

function text(lines: string[]): PortableTextBlock[] {
  return lines.map((line, index) => ({
    _type: 'block',
    _key: `p${index}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `s${index}`, text: line, marks: [] }],
  }))
}

function stamp(day: number) {
  return new Date(Date.UTC(2026, 0, day)).toISOString()
}

const categories: Category[] = [
  { _id: 'category-canvas', title: 'كانفس', slug: 'canvas', description: 'لوحات قماشية للجدران والمعارض.', displayOrder: 1, image: photo('canvas', 'لوحة كانفس على جدار') },
  { _id: 'category-banners', title: 'البانرات', slug: 'banners', description: 'طباعة كبيرة للمحال والمناسبات.', displayOrder: 2, image: photo('fabric', 'قماش للطباعة الكبيرة') },
  { _id: 'category-wooden-plates', title: 'أطباق خشبية', slug: 'wooden-plates', description: 'خشب طبيعي محفور أو مطبوع.', displayOrder: 3, image: photo('wood', 'خشب طبيعي') },
  { _id: 'category-printed-plates', title: 'أطباق مطبوعة', slug: 'printed-plates', description: 'ألواح وأكريليك بطباعة مباشرة.', displayOrder: 4, image: photo('color', 'ألوان طباعة') },
  { _id: 'category-signage', title: 'لافتات', slug: 'signage', description: 'لافتات تعريف للمكاتب والمحال.', displayOrder: 5, image: photo('store', 'واجهة محل') },
  { _id: 'category-personalized', title: 'منتجات شخصية', slug: 'personalized', description: 'هدايا وأسماء ومناسبات.', displayOrder: 6, image: photo('wedding', 'تفاصيل مناسبة') },
  { _id: 'category-other', title: 'أخرى', slug: 'other', description: 'مطبوعات وتجارب لا تقع في تصنيف واحد.', displayOrder: 7, image: photo('desk', 'طاولة تصميم') },
  { _id: 'category-3d-letters', title: 'أحرف ثلاثية الأبعاد', slug: '3d-letters', description: 'حروف بارزة للواجهات والأسماء.', displayOrder: 8, image: photo('wood', 'أحرف ثلاثية الأبعاد') },
  { _id: 'category-vinyl', title: 'الفينيل', slug: 'vinyl', description: 'قص ولصق على الزجاج والجدران والسيارات.', displayOrder: 9, image: photo('color', 'فينيل') },
  { _id: 'category-logos', title: 'الشعارات', slug: 'logos', description: 'تصميم الشعار وتجهيزه للطباعة والتركيب.', displayOrder: 10, image: photo('desk', 'شعار') },
  { _id: 'category-lamayka', title: 'ديكور اللامايكا', slug: 'lamayka', description: 'تغطية الجدران والواجهات بألواح لامايكا.', displayOrder: 11, image: photo('interior', 'ديكور لامايكا') },
  { _id: 'category-neon', title: 'نيون ليد', slug: 'neon-led', description: 'إضاءة نيون للمحال والديكور الداخلي.', displayOrder: 12, image: photo('gallery', 'نيون ليد') },
]

function categoryRef(id: string) {
  const category = categories.find((item) => item._id === id)
  return category ? { title: category.title, slug: category.slug } : null
}

type ProductSeed = {
  id: string
  title: string
  slug: string
  category: string
  short: string
  image: Photo
  gallery: Photo[]
  featured: boolean
  order: number
  materials: string[]
  sizes: string[]
  options: string[]
}

const productSeeds: ProductSeed[] = [
  { id: 'product-wooden-name', title: 'لوحة اسم خشبية شخصية', slug: 'personalized-wooden-name-sign', category: 'category-wooden-plates', short: 'اسم يُحفر على خشب طبيعي، للمكتب أو باب البيت.', image: 'wood', gallery: ['workshop', 'writing'], featured: true, order: 1, materials: ['خشب سنديان', 'خشب جوز'], sizes: ['40×20 سم', '60×25 سم'], options: ['الاسم', 'الخط', 'لون الحفر'] },
  { id: 'product-wall-canvas', title: 'كانفس جداري فاخر', slug: 'premium-wall-canvas', category: 'category-canvas', short: 'طباعة على قماش مشدود بإطار خشبي، لجدار واحد أو لمجموعة.', image: 'canvas', gallery: ['frames', 'paint'], featured: true, order: 2, materials: ['قماش قطني', 'إطار خشب'], sizes: ['40×60 سم', '70×100 سم'], options: ['الصورة', 'الإطار', 'الهامش'] },
  { id: 'product-business-banner', title: 'بانر تجاري حسب الطلب', slug: 'custom-business-banner', category: 'category-banners', short: 'بانر واضح من بعيد، للمعرض أو واجهة المحل أو المناسبة.', image: 'fabric', gallery: ['store', 'color'], featured: true, order: 3, materials: ['فينيل', 'قماش'], sizes: ['100×200 سم', '150×300 سم'], options: ['الشعار', 'النص', 'ألوان الهوية'] },
  { id: 'product-wooden-plate', title: 'طبق خشبي زخرفي', slug: 'decorative-wooden-plate', category: 'category-wooden-plates', short: 'قطعة دائرية تُعلّق أو تُهدى، بنقش أو طباعة ناعمة.', image: 'workshop', gallery: ['wood', 'desk'], featured: false, order: 4, materials: ['خشب زان'], sizes: ['قطر 30 سم', 'قطر 40 سم'], options: ['العبارة', 'الرسم'] },
  { id: 'product-acrylic-sign', title: 'لوحة أكريليك مطبوعة', slug: 'modern-printed-acrylic-sign', category: 'category-printed-plates', short: 'أكريليك بوجه مطبوع، مناسب للمكاتب والاستقبال.', image: 'color', gallery: ['office', 'gallery'], featured: true, order: 5, materials: ['أكريليك شفاف', 'أكريليك أبيض'], sizes: ['30×40 سم', '50×70 سم'], options: ['الشعار', 'المسافات', 'التثبيت'] },
  { id: 'product-wedding-board', title: 'لوحة ترحيب للزفاف', slug: 'custom-wedding-welcome-board', category: 'category-personalized', short: 'لوحة بأسماء العروسين وتاريخ اليوم، للقوس أو المدخل.', image: 'wedding', gallery: ['writing', 'frames'], featured: true, order: 6, materials: ['خشب', 'أكريليك'], sizes: ['50×70 سم', '60×90 سم'], options: ['الأسماء', 'التاريخ', 'الزخرفة'] },
  { id: 'product-canvas-set', title: 'مجموعة كانفس فنية', slug: 'artistic-canvas-collection', category: 'category-canvas', short: 'ثلاث لوحات أو أكثر تُعلَّق معاً بإيقاع واحد.', image: 'paint', gallery: ['canvas', 'living'], featured: false, order: 7, materials: ['قماش'], sizes: ['ثلاث قطع 30×40', 'ثلاث قطع 40×60'], options: ['الألوان', 'عدد القطع'] },
  { id: 'product-office-sign', title: 'لافتة مكتب شخصية', slug: 'personalized-office-signage', category: 'category-signage', short: 'لافتة باب أو مكتب باسم وصفة، بخط واضح وخامة هادئة.', image: 'office', gallery: ['desk', 'interior'], featured: true, order: 8, materials: ['أكريليك', 'خشب'], sizes: ['20×10 سم', '30×12 سم'], options: ['الاسم', 'المسمى', 'الشعار'] },
  { id: 'product-storefront', title: 'لافتة واجهة المحل', slug: 'storefront-banner', category: 'category-banners', short: 'واجهة تُقرأ من الرصيف، بهوية المحل لا بقالب جاهز.', image: 'store', gallery: ['fabric', 'interior'], featured: false, order: 9, materials: ['فينيل خارجي'], sizes: ['حسب الواجهة'], options: ['الشعار', 'ساعات العمل'] },
  { id: 'product-gift-plaque', title: 'هدية خشبية محفورة', slug: 'engraved-gift-plaque', category: 'category-personalized', short: 'لوحة صغيرة تُهدى بمناسبة، مع عبارة تُختار بعناية.', image: 'writing', gallery: ['wood', 'workshop'], featured: false, order: 10, materials: ['خشب'], sizes: ['15×20 سم', '20×30 سم'], options: ['العبارة', 'التاريخ'] },
  { id: 'product-exhibition-plate', title: 'طبق مطبوع للمعارض', slug: 'exhibition-printed-plate', category: 'category-printed-plates', short: 'لوح معلومات أو رقم جناح، خفيف وواضح تحت إضاءة المعرض.', image: 'gallery', gallery: ['color', 'frames'], featured: false, order: 11, materials: ['فوركس', 'أكريليك'], sizes: ['A3', 'A2'], options: ['النص', 'الاتجاه'] },
  { id: 'product-wall-sign', title: 'لافتة جدارية مخصصة', slug: 'custom-wall-signage', category: 'category-signage', short: 'جملة أو شعار يُصنع بمقاس الجدار، للبيت أو للمساحة التجارية.', image: 'interior', gallery: ['living', 'wood'], featured: false, order: 12, materials: ['خشب', 'أكريليك'], sizes: ['حسب الجدار'], options: ['النص', 'اللون', 'العمق'] },
  { id: 'product-3d-letters', title: 'أحرف ثلاثية الأبعاد', slug: '3d-letters', category: 'category-3d-letters', short: 'حروف بارزة تُركَّب على الواجهة، فيظهر الاسم قبل أن يصل الزائر إلى الباب.', image: 'wood', gallery: ['writing', 'workshop'], featured: true, order: 13, materials: ['أكريليك', 'فوم'], sizes: ['حسب الواجهة'], options: ['النص', 'العمق', 'اللون'] },
  { id: 'product-vinyl', title: 'الفينيل', slug: 'vinyl', category: 'category-vinyl', short: 'قص ولصق على الزجاج والجدران والسيارات، بشكل نظيف يثبت على السطح.', image: 'color', gallery: ['fabric', 'desk'], featured: true, order: 14, materials: ['فينيل لاصق'], sizes: ['حسب السطح'], options: ['الشكل', 'اللون', 'المكان'] },
  { id: 'product-logos', title: 'الشعارات', slug: 'logos', category: 'category-logos', short: 'نصمّم الشعار ونجهّزه للطباعة والتركيب، حتى يبقى واضحاً على كل قطعة.', image: 'desk', gallery: ['writing', 'color'], featured: true, order: 15, materials: ['تصميم'], sizes: ['ملفات للطباعة'], options: ['الاسم', 'الألوان', 'الاستخدام'] },
  { id: 'product-lamayka', title: 'ديكور اللامايكا', slug: 'lamayka-decoration', category: 'category-lamayka', short: 'تغطية الجدران والواجهات بألواح لامايكا مزخرفة، بمقاس يناسب المكان.', image: 'interior', gallery: ['gallery', 'living'], featured: true, order: 16, materials: ['ألواح لامايكا'], sizes: ['حسب الجدار'], options: ['النقشة', 'المقاس', 'المكان'] },
  { id: 'product-neon', title: 'نيون ليد', slug: 'neon-led', category: 'category-neon', short: 'إضاءة نيون حديثة للمحال والديكور الداخلي، تُبرز الاسم بعد المغيب.', image: 'gallery', gallery: ['store', 'interior'], featured: true, order: 17, materials: ['ليد', 'أكريليك'], sizes: ['حسب النص'], options: ['النص', 'اللون', 'التثبيت'] },
]

function toCard(seed: ProductSeed): ProductCard {
  return {
    _id: seed.id,
    title: seed.title,
    slug: seed.slug,
    shortDescription: seed.short,
    featured: seed.featured,
    displayOrder: seed.order,
    _createdAt: stamp(seed.order),
    _updatedAt: stamp(20 - seed.order),
    category: categoryRef(seed.category),
    mainImage: photo(seed.image, seed.title),
  }
}

const productCards = productSeeds.map(toCard)

function toDetail(seed: ProductSeed): ProductDetail {
  const related = productCards.filter((item) => item.category?.slug === categoryRef(seed.category)?.slug && item.slug !== seed.slug).slice(0, 3)
  return {
    ...toCard(seed),
    description: text([
      seed.short,
      'نراجع المقاس ومكان التعليق قبل الطباعة، ثم نجهّز القطعة بحيث تصل جاهزة للعرض أو الإهداء.',
      'يمكن تغيير النص أو الألوان حسب طلبكم. أرسلوا الفكرة وسنعود بتصور واضح قبل التنفيذ.',
    ]),
    gallery: seed.gallery.map((name) => photo(name, seed.title)),
    materials: seed.materials,
    sizes: seed.sizes,
    customizationOptions: seed.options,
    related,
  }
}

const services: Service[] = [
  { _id: 'service-canvas', title: 'طباعة الكانفس', slug: 'canvas-printing', description: 'نطبع الصور والأعمال على قماش مشدود، بألوان ثابتة ومقاس يناسب الجدار.', icon: 'frame', displayOrder: 1, image: photo('canvas', 'طباعة كانفس'), category: categoryRef('category-canvas') },
  { _id: 'service-banners', title: 'البانرات والطباعة كبيرة الحجم', slug: 'large-format', description: 'لافتات للمحال والمعارض والمناسبات، تُقرأ من بعيد وتتحمّل مكان العرض.', icon: 'flag', displayOrder: 2, image: photo('fabric', 'طباعة كبيرة'), category: categoryRef('category-banners') },
  { _id: 'service-wood', title: 'اللوحات واللافتات الخشبية', slug: 'wooden-signs', description: 'خشب ننقوشه أو نطبع عليه: أسماء، شعارات، وقطع تُهدى أو تُعلَّق.', icon: 'tree', displayOrder: 3, image: photo('wood', 'خشب محفور'), category: categoryRef('category-wooden-plates') },
  { _id: 'service-signage', title: 'اللافتات المخصصة', slug: 'custom-signage', description: 'لافتات مكاتب ومحال بتصميم يُقرأ بسهولة ويشبه المكان لا الكتالوج.', icon: 'sign', displayOrder: 4, image: photo('store', 'لافتة محل'), category: categoryRef('category-signage') },
  { _id: 'service-gifts', title: 'الإبداعات الشخصية', slug: 'personalized', description: 'هدايا بأسماء وتواريخ: زفاف، مولود، مكتب، أو ذكرى تُحفظ.', icon: 'gift', displayOrder: 5, image: photo('wedding', 'قطعة شخصية'), category: categoryRef('category-personalized') },
  { _id: 'service-brand', title: 'الهوية البصرية والمطبوعات الزخرفية', slug: 'brand-prints', description: 'من علامة صغيرة إلى جدار مطبوع، نُخرج عناصر الهوية بشكل متماسك.', icon: 'palette', displayOrder: 6, image: photo('desk', 'مطبوعات الهوية'), category: categoryRef('category-other') },
]

type ProjectSeed = {
  id: string
  title: string
  slug: string
  summary: string
  category: string
  client: string
  year: number
  cover: Photo
  gallery: Photo[]
  before?: Photo
  after?: Photo
  services: string[]
  materials: string[]
  story: string[]
}

const projectSeeds: ProjectSeed[] = [
  { id: 'project-cafe', title: 'هوية مقهى النور', slug: 'noor-cafe-identity', summary: 'لافتة واجهة، منيو جداري، ولوحة ترحيب داخلية بهوية واحدة.', category: 'category-signage', client: 'مقهى النور', year: 2025, cover: 'store', gallery: ['interior', 'wood', 'desk'], before: 'workshop', after: 'store', services: ['لافتة واجهة', 'لوحة داخلية', 'منيو مطبوع'], materials: ['خشب', 'أكريليك', 'فينيل'], story: ['بدأ الطلب بشعار صغير على الهاتف، وانتهى بواجهة تُرى من آخر الشارع.', 'ثبّتنا لون القهوة المحمّصة مع الذهبي، وجعلنا الاسم يُقرأ قبل أن يصل الزائر إلى الباب.'] },
  { id: 'project-wedding', title: 'مجموعة زفاف ليلى وآدم', slug: 'layla-adam-wedding', summary: 'لوحة ترحيب، أرقام طاولات، ولوحة مدخل من الخشب والقماش.', category: 'category-personalized', client: 'ليلى وآدم', year: 2024, cover: 'wedding', gallery: ['writing', 'frames'], services: ['لوحة ترحيب', 'أرقام طاولات'], materials: ['خشب', 'قماش'], story: ['الأسماء كُتبت بخط واحد على كل القطع حتى تبدو القاعة وكأنها صُمّمت معاً.', 'اللوحة الرئيسية وُضعت عند المدخل، وأرقام الطاولات بقيت خفيفة كي لا تزاحم الزهور.'] },
  { id: 'project-boutique', title: 'واجهة بوتيك دار القماش', slug: 'dar-al-qomash-facade', summary: 'لافتة عريضة ولوحات داخلية لقسم الأقمشة الموسمية.', category: 'category-banners', client: 'دار القماش', year: 2025, cover: 'fabric', gallery: ['gallery', 'color'], services: ['طباعة كبيرة', 'لوحات داخلية'], materials: ['فينيل خارجي', 'فوركس'], story: ['الواجهة كانت مزدحمة بالملصقات. أبقينا اسماً واحداً ومقاساً يُرى من السيارة.', 'في الداخل، لوحات أقصر تعرّف كل قسم من غير أن تغطي القماش.'] },
  { id: 'project-home', title: 'جدار فني لمنزل خاص', slug: 'private-home-gallery-wall', summary: 'مجموعة كانفس وقطعة خشب صغيرة فوق الكنبة.', category: 'category-canvas', client: 'منزل خاص', year: 2026, cover: 'living', gallery: ['paint', 'canvas', 'frames'], services: ['كانفس', 'لوحة خشب'], materials: ['قماش', 'خشب'], story: ['اختار أهل البيت ثلاث صور من سفرهم، وطلبوا ألا تتحول إلى ملصق لامع.', 'طبعناها على قماش مطفي، وأضفنا لوحة خشب باسم البيت تحت المجموعة.'] },
]

function toProjectCard(seed: ProjectSeed, index: number): ProjectCard {
  return {
    _id: seed.id,
    title: seed.title,
    slug: seed.slug,
    summary: seed.summary,
    client: seed.client,
    year: seed.year,
    featured: true,
    _createdAt: stamp(index + 1),
    category: categoryRef(seed.category),
    coverImage: photo(seed.cover, seed.title),
  }
}

const projectCards = projectSeeds.map(toProjectCard)

function toProjectDetail(seed: ProjectSeed, index: number): ProjectDetail {
  return {
    ...toProjectCard(seed, index),
    description: text(seed.story),
    images: seed.gallery.map((name) => photo(name, seed.title)),
    beforeImage: seed.before ? photo(seed.before, `قبل: ${seed.title}`) : undefined,
    afterImage: seed.after ? photo(seed.after, `بعد: ${seed.title}`) : undefined,
    services: seed.services,
    materials: seed.materials,
    related: projectCards.filter((item) => item.slug !== seed.slug).slice(0, 2),
  }
}

const testimonials: Testimonial[] = [
  { _id: 'testimonial-nour', customerName: 'نور الخطيب', role: 'صاحبة مقهى', content: 'اللافتة صارت أوضح من الاسم على الخرائط. الزبون يراها قبل أن يسأل.', rating: 5, featured: true },
  { _id: 'testimonial-sami', customerName: 'سامي قاسم', role: 'مدير مكتب', content: 'لافتات المكاتب وصلت بالمقاس المتفق عليه، والخط يُقرأ من طرف الممر.', rating: 5, featured: true },
  { _id: 'testimonial-hala', customerName: 'هالة مرعي', role: 'عروس', content: 'لوحة الترحيب كانت أثقل من الصورة في الخيال، بالمعنى الجيد. الضيوف صوّروها قبل القاعة.', rating: 5, featured: true },
]

const homepage: Homepage = {
  heroImages: [photo('canvas', 'كانفس معلّق'), photo('wood', 'لوحة خشب'), photo('interior', 'جدار منسق')],
}

const about: AboutPage = {
  eyebrow: 'الاستوديو',
  title: 'نصنع ما يُعلَّق ويُهدى',
  introduction: 'سبيتي استوديو للطباعة والتصميم حسب الطلب. نعمل مع من يريد قطعة تشبهه: لوحة في البيت، لافتة للمحل، أو هدية تُحفظ.',
  companyStory: text([
    'بدأ العمل من طاولة ضيقة وطلبات بسيطة: اسم على خشب، وصورة على قماش. مع الوقت صارت الطلبات واجهات محال ومجموعات زفاف وجدراناً كاملة.',
    'ما لم يتغير هو الطريقة. نسأل عن المكان قبل أن نسأل عن المقاس، ونرفض أن تخرج القطعة لامعة إذا كان الجدار هادئاً.',
  ]),
  mission: 'نحوّل الفكرة إلى قطعة ملموسة، واضحة، ومتقنة، من غير أن نُغرق صاحبها في تعقيد التنفيذ.',
  values: [
    { _key: 'v1', title: 'الوضوح', description: 'نعرف ماذا سنصنع قبل أن نبدأ، ونقوله بلغة مفهومة.' },
    { _key: 'v2', title: 'العناية', description: 'الحافة والخط والمسافة ليست تفاصيل صغيرة.' },
    { _key: 'v3', title: 'أمانة الخامة', description: 'نقترح الخامة التي تعيش في المكان، لا الأرخص ولا الأثقل دائماً.' },
    { _key: 'v4', title: 'احترام الفكرة', description: 'صاحب الطلب يبقى صاحب القطعة. نحن نُحسن تنفيذها.' },
  ],
  expertise: [
    { _key: 'e1', title: 'الكانفس والجدار', description: 'صور ومجموعات تُعلَّق بإيقاع واحد.' },
    { _key: 'e2', title: 'الطباعة الكبيرة', description: 'بانرات وواجهات تُقرأ من مسافة.' },
    { _key: 'e3', title: 'الخشب', description: 'أسماء وهدايا ولافتات محفورة أو مطبوعة.' },
    { _key: 'e4', title: 'اللافتات المكتبية', description: 'تعريف هادئ للمكاتب والاستقبال.' },
  ],
  materialsText: 'نعمل على القماش، والخشب الطبيعي، والأكريليك، وألواح الطباعة. نختار التشطيب حسب مكان العرض: بيت، محل، مناسبة، أو مكتب.',
  processSteps: [
    { _key: 'p1', title: 'الفكرة', description: 'نستمع للمكان والنص والمناسبة.' },
    { _key: 'p2', title: 'التصور', description: 'نقترح التكوين والخامة.' },
    { _key: 'p3', title: 'التنفيذ', description: 'نطبع أو نحفر ونراجع.' },
    { _key: 'p4', title: 'التسليم', description: 'القطعة تخرج جاهزة.' },
  ],
  images: [photo('workshop', 'طاولة العمل'), photo('frames', 'إطارات جاهزة'), photo('living', 'جدار في منزل')],
}

const settings: SiteSettings = {
  companyName: 'سبيتي',
  tagline: 'نصنع ما يُعلَّق، ويُهدى، ويُرى',
  description: 'استوديو سبيتي للطباعة والتصميم حسب الطلب. لوحات كانفس، لافتات، أخشاب، ومطبوعات تُصنع بعناية.',
  email: 'hello@sbeity.example',
  phone: '+961 70 000 000',
  whatsapp: '96170000000',
  address: 'بيروت، لبنان',
}

export const preview = {
  settings,
  categories,
  services,
  testimonials,
  homepage,
  about,
  products: productCards,
  projects: projectCards,
  product(slug: string) {
    const seed = productSeeds.find((item) => item.slug === slug)
    return seed ? toDetail(seed) : null
  },
  project(slug: string) {
    const index = projectSeeds.findIndex((item) => item.slug === slug)
    return index >= 0 ? toProjectDetail(projectSeeds[index], index) : null
  },
}
