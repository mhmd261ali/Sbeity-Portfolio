import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { parseRgb } from '@/components/home/gl/color'
import { startLightEngine, type LightCommand, type LightSettings } from '@/components/home/gl/lightPillarEngine'
import { attachGlWorker, bindGlSurface, readSurfaceSize, type ThreadHandle } from '@/components/home/gl/surface'

export interface LightPillarProps {
  topColor?: string
  bottomColor?: string
  intensity?: number
  rotationSpeed?: number
  flow?: number
  interactive?: boolean
  clickPulse?: boolean
  glowAmount?: number
  bloom?: number
  pillarWidth?: number
  pillarHeight?: number
  pillarRotation?: number
  twist?: number
  detail?: number
  noiseIntensity?: number
  fade?: number
  intro?: boolean
  mixBlendMode?: CSSProperties['mixBlendMode']
  quality?: 'low' | 'medium' | 'high'
  resolution?: number
  lightMode?: boolean
  shift?: number
  paused?: boolean
  className?: string
  style?: CSSProperties
}

const QUALITY: Record<string, number> = { low: 0.35, medium: 0.5, high: 0.6 }
const MIN_SCALE = 0.25
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const LightPillar = ({
  topColor = '#5227FF',
  bottomColor = '#FF9FFC',
  intensity = 1.0,
  rotationSpeed = 0.3,
  flow = 1,
  interactive = true,
  clickPulse = true,
  glowAmount = 0.002,
  bloom = 0.5,
  pillarWidth = 3.0,
  pillarHeight = 0.4,
  pillarRotation = 25,
  twist = 0.4,
  detail = 4,
  noiseIntensity = 0.5,
  fade = 0,
  intro = true,
  mixBlendMode = 'screen',
  quality = 'high',
  resolution,
  lightMode = false,
  shift = 0,
  paused = false,
  className = '',
  style,
}: LightPillarProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const postRef = useRef<((message: LightCommand) => void) | null>(null)
  const [generation, setGeneration] = useState(0)

  const settings = useMemo<LightSettings>(() => {
    return {
      topColor: parseRgb(String(topColor)),
      bottomColor: parseRgb(String(bottomColor)),
      intensity: Math.max(0, intensity),
      rotationSpeed,
      flow,
      interactive,
      clickPulse,
      glowAmount: Math.max(0, glowAmount),
      bloom: Math.max(0, bloom),
      pillarWidth: Math.max(0.05, pillarWidth),
      pillarHeight,
      pillarRotation,
      twist,
      detail: Math.round(clamp(detail, 1, 6)),
      noiseIntensity: Math.max(0, noiseIntensity),
      fade: clamp(fade, 0, 1),
      intro,
      scale: clamp(resolution ?? QUALITY[quality] ?? QUALITY.high, MIN_SCALE, 2),
      lightMode,
      shift,
      paused,
    }
  }, [
    topColor,
    bottomColor,
    intensity,
    rotationSpeed,
    flow,
    interactive,
    clickPulse,
    glowAmount,
    bloom,
    pillarWidth,
    pillarHeight,
    pillarRotation,
    twist,
    detail,
    noiseIntensity,
    fade,
    intro,
    resolution,
    quality,
    lightMode,
    shift,
    paused,
  ])
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const canvas = document.createElement('canvas')
    canvas.className = 'absolute inset-0 block h-full w-full'
    canvas.setAttribute('aria-hidden', 'true')
    container.appendChild(canvas)

    const size = readSurfaceSize(container)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const snapshot = {
      width: size.width,
      height: size.height,
      dpr: size.dpr,
      reducedMotion,
      hidden: document.hidden,
      settings: settingsRef.current,
    }
    const recover = () => setGeneration((value) => value + 1)
    const runHere = (node: HTMLCanvasElement) => startLightEngine({ ...snapshot, canvas: node, onContextLost: recover })
    let thread: ThreadHandle<LightCommand>
    if (typeof canvas.transferControlToOffscreen !== 'function') {
      thread = runHere(canvas)
    } else {
      const worker = new Worker(new URL('./gl/lightPillar.worker.ts', import.meta.url), {
        type: 'module',
        name: 'light-pillar',
      })
      thread = attachGlWorker(worker, canvas, snapshot, runHere, (data) => {
        if (typeof data === 'object' && data !== null && 'type' in data && data.type === 'contextlost') recover()
      })
    }
    postRef.current = thread.post
    const unbind = bindGlSurface(container, thread.post)
    return () => {
      postRef.current = null
      unbind()
      thread.dispose()
      container.replaceChildren()
    }
  }, [generation])

  useEffect(() => {
    postRef.current?.({ type: 'settings', settings })
  }, [settings])

  return (
    <div ref={containerRef} className={`absolute top-0 left-0 h-full w-full ${className}`} style={{ mixBlendMode, ...style }} />
  )
}

export default LightPillar
