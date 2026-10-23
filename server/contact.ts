import nodemailer from 'nodemailer'
import { looksLikeSpam, validateContact, type ContactInput } from '../src/lib/contact/schema'
import { checkRateLimit } from './rateLimit'

const attempts = new Map<string, number[]>()

export type ContactResult = {
  status: number
  body: { ok: boolean; message?: string }
}

function allowedOrigin(origin?: string) {
  if (!origin) return true
  const allowed = new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
  ])
  const site = (process.env.SITE_URL || process.env.VITE_SITE_URL || '').replace(/\/$/, '')
  if (site) allowed.add(site)
  if (process.env.VERCEL_URL) allowed.add(`https://${process.env.VERCEL_URL}`)
  return allowed.has(origin)
}

function messageBody(data: ContactInput) {
  return [
    `الاسم: ${data.name}`,
    `البريد: ${data.email}`,
    `الهاتف: ${data.phone}`,
    data.service ? `الخدمة: ${data.service}` : null,
    data.productTitle ? `المنتج: ${data.productTitle}` : null,
    data.productSlug ? `رابط المنتج: /products/${data.productSlug}` : null,
    '',
    data.message,
  ]
    .filter((line) => line !== null)
    .join('\n')
}

async function sendWithResend(data: ContactInput, text: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      reply_to: data.email,
      subject: data.subject,
      text,
    }),
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) {
    throw new Error('Resend rejected the message')
  }
}

async function sendWithSmtp(data: ContactInput, text: string) {
  const port = Number(process.env.SMTP_PORT || 587)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  })

  await transporter.sendMail({
    from: process.env.CONTACT_FROM_EMAIL,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: data.email,
    subject: data.subject,
    text,
  })
}

export async function processContact(input: unknown, meta: { ip: string; origin?: string }): Promise<ContactResult> {
  if (!allowedOrigin(meta.origin)) {
    return { status: 403, body: { ok: false, message: 'مصدر الطلب غير مسموح' } }
  }

  if (!checkRateLimit(attempts, meta.ip || 'unknown', Date.now())) {
    return { status: 429, body: { ok: false, message: 'وصلت محاولات كثيرة. حاول بعد قليل.' } }
  }

  const payloadSize = JSON.stringify(input ?? '').length
  if (payloadSize > 20000) {
    return { status: 413, body: { ok: false, message: 'الرسالة كبيرة جداً' } }
  }

  const parsed = validateContact(input)
  if (!parsed.ok) return { status: 400, body: { ok: false, message: parsed.message } }

  if (looksLikeSpam(parsed.data)) {
    return { status: 200, body: { ok: true } }
  }

  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL
  if (!to || !from || (!process.env.RESEND_API_KEY && !process.env.SMTP_HOST)) {
    return {
      status: 503,
      body: { ok: false, message: 'نموذج التواصل غير مهيأ بعد. راسلونا عبر الهاتف أو واتساب.' },
    }
  }

  try {
    const text = messageBody(parsed.data)
    if (process.env.RESEND_API_KEY) await sendWithResend(parsed.data, text)
    else await sendWithSmtp(parsed.data, text)
    return { status: 200, body: { ok: true, message: 'وصلتنا رسالتكم.' } }
  } catch {
    return { status: 502, body: { ok: false, message: 'تعذر إرسال الرسالة الآن. حاولوا مرة أخرى.' } }
  }
}
