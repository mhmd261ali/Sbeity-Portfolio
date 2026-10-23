import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'أدخل الاسم').max(80, 'الاسم طويل جداً'),
  email: z.email('أدخل بريداً إلكترونياً صالحاً'),
  phone: z.string().trim().min(6, 'أدخل رقم الهاتف').max(30, 'رقم الهاتف طويل جداً'),
  service: z.string().trim().max(160),
  subject: z.string().trim().min(2, 'أدخل عنوان الرسالة').max(160, 'العنوان طويل جداً'),
  productTitle: z.string().trim().max(180),
  productSlug: z.string().trim().max(180),
  message: z.string().trim().max(4000, 'الرسالة طويلة جداً'),
  companyWebsite: z.string().max(200),
})

export type ContactInput = z.infer<typeof contactSchema>

export function validateContact(input: unknown) {
  const parsed = contactSchema.safeParse(input)
  if (parsed.success) return { ok: true as const, data: parsed.data }

  const message = parsed.error.issues[0]?.message || 'تحقق من الحقول وحاول مرة أخرى'
  return { ok: false as const, message }
}

export function looksLikeSpam(data: Pick<ContactInput, 'companyWebsite' | 'message'>) {
  if (data.companyWebsite.trim()) return true
  const links = data.message.match(/https?:\/\//gi)?.length ?? 0
  return links > 5
}
