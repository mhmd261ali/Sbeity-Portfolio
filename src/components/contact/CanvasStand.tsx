import { useLayoutEffect, useRef, type ReactNode } from 'react'

export function CanvasStand({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const slotRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const slot = slotRef.current
    if (!canvas || !slot) return
    const media = window.matchMedia('(min-width: 1024px)')
    const fit = () => {
      slot.style.height = media.matches ? `${canvas.offsetHeight / 2}px` : ''
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(canvas)
    media.addEventListener('change', fit)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', fit)
    }
  }, [])

  return (
    <div className="easel">
      <div className="easel-mast" aria-hidden>
        <span className="easel-jaw" />
      </div>
      <div className="easel-canvas-slot" ref={slotRef}>
        <div className="easel-canvas" ref={canvasRef}>
          <div className="easel-workspace">{children}</div>
        </div>
      </div>
      <div className="easel-shelf" aria-hidden />
      <div className="easel-base" aria-hidden>
        <span className="easel-back-leg" />
        <span className="easel-leg easel-leg-a" />
        <span className="easel-leg easel-leg-b" />
        <span className="easel-brace" />
        <span className="easel-floor" />
      </div>
    </div>
  )
}
