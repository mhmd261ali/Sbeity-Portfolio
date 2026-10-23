import { Link } from 'react-router'

export function EmptyState({ title, text, action }: { title: string; text: string; action?: { to: string; label: string } }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-line bg-white px-6 py-16 text-center">
      <img src="/brand/logo.png" alt="" className="mx-auto h-14 w-14" />
      <h3 className="mt-5 font-display text-3xl text-blue">{title}</h3>
      <p className="mx-auto mt-3 max-w-md leading-8 text-muted">{text}</p>
      {action && (
        <Link to={action.to} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-blue px-5 text-sm font-semibold text-white">
          {action.label}
        </Link>
      )}
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="rounded-[2rem] border border-line bg-white px-6 py-16 text-center" role="alert">
      <h2 className="font-display text-3xl text-blue">تعذر تحميل المحتوى</h2>
      <p className="mt-3 text-muted">تحققوا من الاتصال أو من إعدادات Sanity، ثم أعيدوا المحاولة.</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-gold px-5 text-sm font-semibold text-blue">
          إعادة المحاولة
        </button>
      )}
    </div>
  )
}
