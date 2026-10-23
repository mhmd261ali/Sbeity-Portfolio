import { useEffect, useState, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { contactSchema, type ContactInput } from '@/lib/contact/schema'
import { cn } from '@/utils/cn'

type ServiceOption = { title: string }

export function ContactForm({ productSlug = '', productTitle = '', intent = 'quote', canvas = false, services = [], actions = null }: { productSlug?: string; productTitle?: string; intent?: string; canvas?: boolean; services?: ServiceOption[]; actions?: ReactNode }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')
  const subject = defaultSubject(intent, productTitle)
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: '',
      subject,
      productTitle,
      productSlug,
      message: '',
      companyWebsite: '',
    },
  })

  useEffect(() => {
    if (!productTitle) return
    form.setValue('productTitle', productTitle)
    form.setValue('productSlug', productSlug)
    form.setValue('subject', defaultSubject(intent, productTitle))
  }, [form, intent, productSlug, productTitle])

  async function onSubmit(values: ContactInput) {
    setStatus('loading')
    setFeedback('')
    const subjectLine = values.service || (productTitle ? defaultSubject(intent, productTitle) : 'طلب تواصل')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, subject: subjectLine }),
      })
      const body = (await response.json()) as { ok?: boolean; message?: string }
      if (!response.ok || !body.ok) {
        setStatus('error')
        setFeedback(body.message || 'تعذر إرسال الرسالة')
        return
      }
      setStatus('success')
      setFeedback(body.message || 'وصلتنا رسالتكم، وسنرد في أقرب وقت.')
      form.reset({ ...values, message: '', service: '', companyWebsite: '', subject: subjectLine })
    } catch {
      setStatus('error')
      setFeedback('تعذر الاتصال بالخادم. حاولوا مرة أخرى أو راسلونا عبر واتساب.')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className={canvas ? 'py-6' : 'rounded-[1.8rem] bg-mist p-8'}>
        <h2 className="font-display text-5xl text-blue">وصلتنا رسالتكم</h2>
        <p className="mt-4 text-xl leading-9 text-muted">{feedback}</p>
        <button type="button" className="mt-6 text-lg font-semibold underline decoration-gold underline-offset-4" onClick={() => setStatus('idle')}>
          إرسال رسالة أخرى
        </button>
      </div>
    )
  }

  const errors = form.formState.errors
  const choices = services.filter((service) => service.title)

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className={cn('relative', canvas ? 'space-y-6' : 'space-y-5')}>
      <div className="absolute h-px w-px overflow-hidden" aria-hidden>
        <label>
          الموقع
          <input tabIndex={-1} autoComplete="off" {...form.register('companyWebsite')} />
        </label>
      </div>
      <input type="hidden" {...form.register('subject')} />
      <input type="hidden" {...form.register('productTitle')} />
      <input type="hidden" {...form.register('productSlug')} />
      <Field label="الاسم" error={errors.name?.message} id="name" canvas={canvas} required>
        <input id="name" autoComplete="name" required aria-required="true" className={inputClass(Boolean(errors.name), canvas)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} {...form.register('name')} />
      </Field>
      <Field label="البريد الإلكتروني" error={errors.email?.message} id="email" canvas={canvas} required>
        <input id="email" type="email" autoComplete="email" required aria-required="true" dir={canvas ? 'ltr' : undefined} className={cn(inputClass(Boolean(errors.email), canvas), canvas && 'text-right')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} {...form.register('email')} />
      </Field>
      <Field label="رقم الهاتف" error={errors.phone?.message} id="phone" canvas={canvas} required>
        <input id="phone" type="tel" autoComplete="tel" required aria-required="true" dir={canvas ? 'ltr' : undefined} className={cn(inputClass(Boolean(errors.phone), canvas), canvas && 'text-right')} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} {...form.register('phone')} />
      </Field>
      <Field label="الخدمة" error={errors.service?.message} id="service" canvas={canvas}>
        <select id="service" className={inputClass(Boolean(errors.service), canvas)} aria-invalid={Boolean(errors.service)} {...form.register('service')}>
          <option value="">اختروا خدمة</option>
          {choices.map((service) => (
            <option key={service.title} value={service.title}>{service.title}</option>
          ))}
        </select>
      </Field>
      <Field label="الرسالة" error={errors.message?.message} id="message" canvas={canvas}>
        <textarea id="message" rows={canvas ? 4 : 6} className={canvas ? canvasArea(Boolean(errors.message)) : cn(inputClass(Boolean(errors.message)), 'rounded-3xl py-3')} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} {...form.register('message')} />
      </Field>
      {status === 'error' && (
        <p role="alert" className="rounded-2xl bg-mist px-4 py-3 text-lg text-blue">
          {feedback}
        </p>
      )}
      <div className={cn('flex items-center justify-between gap-4', canvas && 'mt-2')}>
        <button type="submit" disabled={status === 'loading'} className={cn('inline-flex items-center rounded-full bg-gold px-8 py-3 text-xl font-semibold leading-none text-blue disabled:opacity-60', canvas && 'lg:px-10 lg:py-4 lg:text-[2.5rem]')}>
          {status === 'loading' ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}
        </button>
        {actions}
      </div>
    </form>
  )
}

function defaultSubject(intent: string, title: string) {
  if (!title) return intent === 'ask' ? 'استفسار عن منتج' : 'طلب عرض سعر'
  return intent === 'ask' ? `استفسار عن منتج: ${title}` : `طلب عرض سعر: ${title}`
}

const lineFocus = 'outline-none focus:outline-none focus-visible:outline-none focus:border-b-2 focus:border-blue focus-visible:border-b-2 focus-visible:border-blue'

function inputClass(invalid: boolean, canvas = false) {
  if (canvas) {
    return cn('min-h-14 w-full border-0 border-b bg-transparent px-0.5 text-2xl text-blue lg:min-h-20 lg:text-4xl', lineFocus, invalid ? 'border-b-2 border-blue' : 'border-blue/30')
  }
  return cn('min-h-14 w-full rounded-full border bg-white px-4 text-lg outline-none focus:outline-none focus-visible:outline-none', invalid ? 'border-blue' : 'border-line focus:border-blue')
}

function canvasArea(invalid: boolean) {
  return cn('min-h-36 w-full resize-y border-0 border-b bg-transparent px-0.5 py-3 text-2xl text-blue lg:min-h-48 lg:text-4xl', lineFocus, invalid ? 'border-b-2 border-blue' : 'border-blue/25')
}

function Field({ id, label, error, canvas = false, required = false, children }: { id: string; label: string; error?: string; canvas?: boolean; required?: boolean; children: ReactNode }) {
  return (
    <div className={cn(canvas && 'lg:grid lg:grid-cols-[max-content_minmax(0,1fr)] lg:items-center lg:gap-x-8')}>
      <label htmlFor={id} className={cn('mb-2 block text-xl font-semibold text-blue', canvas && 'mb-3 lg:mb-0 lg:text-[2.5rem]')}>
        {label}
        {required ? <span className="text-gold-deep"> *</span> : <span className="font-medium text-muted"> (اختياري)</span>}
      </label>
      <div className="min-w-0">
        {children}
        {error && (
          <p id={`${id}-error`} className="mt-1 text-base text-blue">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
