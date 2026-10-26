export type SurfaceEvent =
  | { type: 'resize'; width: number; height: number; dpr: number }
  | { type: 'visible'; visible: boolean }
  | { type: 'hidden'; hidden: boolean }
  | { type: 'reduced'; reducedMotion: boolean }
  | {
      type: 'pointer'
      phase: 'move' | 'down' | 'up' | 'leave'
      x: number
      y: number
      inside: boolean
      pointerType: string
    }

export interface ThreadHandle<T> {
  post: (message: T) => void
  dispose: () => void
}

export function readSurfaceSize(container: HTMLElement) {
  return {
    width: Math.max(1, container.clientWidth),
    height: Math.max(1, container.clientHeight),
    dpr: window.devicePixelRatio || 1,
  }
}

export function bindGlSurface(container: HTMLElement, post: (event: SurfaceEvent) => void) {
  let moveFrame = 0
  let latestMove: PointerEvent | null = null

  const locate = (event: PointerEvent) => {
    const rect = container.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return {
      x,
      y,
      inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height,
      pointerType: event.pointerType,
    }
  }

  const sendSize = () => post({ type: 'resize', ...readSurfaceSize(container) })

  const onMove = (event: PointerEvent) => {
    latestMove = event
    if (moveFrame) return
    moveFrame = requestAnimationFrame(() => {
      moveFrame = 0
      const current = latestMove
      latestMove = null
      if (!current) return
      post({ type: 'pointer', phase: 'move', ...locate(current) })
    })
  }

  const onDown = (event: PointerEvent) => post({ type: 'pointer', phase: 'down', ...locate(event) })
  const onUp = (event: PointerEvent) => post({ type: 'pointer', phase: 'up', ...locate(event) })
  const onLeaveWindow = (event: PointerEvent) => {
    if (event.relatedTarget) return
    post({ type: 'pointer', phase: 'leave', ...locate(event), inside: false })
  }
  const onBlur = () => post({ type: 'pointer', phase: 'leave', x: 0, y: 0, inside: false, pointerType: '' })
  const onVisibility = () => post({ type: 'hidden', hidden: document.hidden })
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const onReduced = () => post({ type: 'reduced', reducedMotion: reducedQuery.matches })

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  window.addEventListener('pointerup', onUp, { passive: true })
  window.addEventListener('pointerout', onLeaveWindow, { passive: true })
  window.addEventListener('blur', onBlur)
  document.documentElement.addEventListener('pointerleave', onBlur)
  document.addEventListener('visibilitychange', onVisibility)
  reducedQuery.addEventListener('change', onReduced)
  window.addEventListener('resize', sendSize)

  const resizeObserver = new ResizeObserver(sendSize)
  resizeObserver.observe(container)
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    post({ type: 'visible', visible: Boolean(entry?.isIntersecting) })
  })
  intersectionObserver.observe(container)
  sendSize()
  post({ type: 'hidden', hidden: document.hidden })
  post({ type: 'reduced', reducedMotion: reducedQuery.matches })

  return () => {
    cancelAnimationFrame(moveFrame)
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointerout', onLeaveWindow)
    window.removeEventListener('blur', onBlur)
    document.documentElement.removeEventListener('pointerleave', onBlur)
    document.removeEventListener('visibilitychange', onVisibility)
    reducedQuery.removeEventListener('change', onReduced)
    window.removeEventListener('resize', sendSize)
  }
}

export function launchGlThread<T extends { type: string }>(
  url: URL,
  canvas: HTMLCanvasElement,
  init: object,
  name: string,
  fallback: (canvas: HTMLCanvasElement) => ThreadHandle<T>,
  onWorkerMessage?: (data: unknown) => void,
): ThreadHandle<T> {
  if (typeof Worker === 'undefined' || typeof canvas.transferControlToOffscreen !== 'function') {
    return fallback(canvas)
  }

  let worker: Worker
  try {
    worker = new Worker(url, { type: 'module', name })
  } catch {
    return fallback(canvas)
  }

  try {
    const offscreen = canvas.transferControlToOffscreen()
    worker.postMessage({ type: 'init', canvas: offscreen, ...init }, [offscreen])
    if (onWorkerMessage) {
      worker.onmessage = (event: MessageEvent<unknown>) => onWorkerMessage(event.data)
    }
  } catch {
    worker.terminate()
    return fallback(canvas)
  }

  return {
    post: (message) => worker.postMessage(message),
    dispose: () => worker.terminate(),
  }
}
