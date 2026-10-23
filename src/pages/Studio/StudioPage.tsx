import { lazy, Suspense, useEffect } from 'react'

const StudioApp = lazy(async () => {
  const [{ Studio }, configModule] = await Promise.all([import('sanity'), import('../../../sanity.config')])
  return {
    default: function MountedStudio() {
      return <Studio config={configModule.default} />
    },
  }
})

export function StudioPage() {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID

  useEffect(() => {
    document.title = 'لوحة التحكم | سبيتي'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    return () => robots.remove()
  }, [])

  if (!projectId) {
    return (
      <main className="grid min-h-dvh place-items-center bg-white px-6 text-blue" dir="rtl">
        <div className="max-w-xl">
          <img src="/brand/logo.png" alt="" className="h-16 w-16" />
          <h1 className="mt-6 font-display text-4xl">لوحة التحكم غير مهيأة</h1>
          <p className="mt-4 leading-8 text-muted">
            أضيفوا معرّف مشروع Sanity إلى ملف البيئة، ثم أعيدوا تشغيل الموقع. خطوات الإعداد مكتوبة في ملف README.
          </p>
          <a href="/" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-gold px-5 font-semibold text-blue">
            العودة إلى الموقع
          </a>
        </div>
      </main>
    )
  }

  return (
    <div className="h-dvh overflow-hidden bg-white">
      <Suspense fallback={<div className="grid h-dvh place-items-center font-display text-2xl text-blue">جارٍ فتح لوحة التحكم</div>}>
        <StudioApp />
      </Suspense>
    </div>
  )
}
