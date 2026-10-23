import { Reveal } from '@/components/animations/Reveal'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { useSite } from '@/components/layout/SiteContext'

export function NotFoundPage() {
  const { companyName } = useSite()
  return (
    <section className="grid min-h-[80vh] place-items-center px-6 pt-24 text-center">
      <Seo title={`الصفحة غير موجودة | ${companyName}`} description="الصفحة المطلوبة غير متاحة." path="/404" />
      <Reveal>
      <div>
        <p className="font-display text-7xl text-gold">404</p>
        <h1 className="mt-4 font-display text-5xl text-blue">هذه الصفحة غير موجودة</h1>
        <p className="mt-4 text-muted">ربما نُقل الرابط، أو أن العنوان غير مكتمل.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button to="/">الرئيسية</Button>
          <Button to="/products" variant="line">
            المنتجات
          </Button>
        </div>
      </div>
      </Reveal>
    </section>
  )
}
