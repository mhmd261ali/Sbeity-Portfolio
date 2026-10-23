import type { SocialLink } from '@/types/content'
import { cn } from '@/utils/cn'

const labels: Record<string, string> = {
  instagram: 'إنستغرام',
  facebook: 'فيسبوك',
  tiktok: 'تيك توك',
  linkedin: 'لينكدإن',
  pinterest: 'بينترست',
  youtube: 'يوتيوب',
  x: 'إكس',
  other: 'رابط',
}

export function SocialLinks({ links, className, light = false }: { links?: SocialLink[]; className?: string; light?: boolean }) {
  const items = (links ?? []).filter((link) => link.url)
  if (!items.length) return null

  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {items.map((link) => (
        <li key={link._key || link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className={cn(
              'inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold transition',
              light ? 'bg-white/10 text-white hover:bg-white hover:text-blue' : 'bg-mist text-blue hover:bg-gold',
            )}
          >
            {labels[link.platform || 'other'] || labels.other}
          </a>
        </li>
      ))}
    </ul>
  )
}
