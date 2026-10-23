import { Link } from 'react-router'
import { SanityImage } from '@/components/galleries/SanityImage'
import type { ProjectCard as ProjectCardData } from '@/types/content'
import { cn } from '@/utils/cn'

export function ProjectCard({ project, className, large = false }: { project: ProjectCardData; className?: string; large?: boolean }) {
  const meta = [project.category?.title, project.year, project.client].filter(Boolean).join(' · ')

  return (
    <article className={cn(className)}>
      <Link to={`/our-work/${project.slug}`} className="group block focus-visible:outline-offset-8" data-cursor="view">
        <div className={cn('relative overflow-hidden rounded-[1.8rem] bg-blue', large ? 'aspect-[16/9] md:aspect-[16/8]' : 'aspect-[16/11]')}>
          <SanityImage
            image={project.coverImage}
            sizes={large ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
            className="transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue from-15% via-blue/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
            {meta && <p className="text-sm text-gold">{meta}</p>}
            <h3 className={cn('mt-2 font-display leading-tight', large ? 'text-4xl md:text-5xl' : 'text-3xl')}>{project.title}</h3>
            {project.summary && <p className="mt-3 max-w-xl text-sm leading-7 text-white/80">{project.summary}</p>}
          </div>
        </div>
      </Link>
    </article>
  )
}
