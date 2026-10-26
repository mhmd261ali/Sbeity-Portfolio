import { useEffect, useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import { parseColor } from '@/components/home/gl/color'
import {
  startPatternEngine,
  type FadeKind,
  type PatternCommand,
  type PatternKind,
  type PatternSettings,
  type WaveKind,
} from '@/components/home/gl/patternEngine'
import { bindGlSurface, launchGlThread, readSurfaceSize } from '@/components/home/gl/surface'

type SurfacePreset = 'silk' | 'ocean' | 'pond' | 'lines' | 'terminal' | 'mesh'

interface PresetValues {
  pattern: PatternKind
  wave: WaveKind
  spacing: number
  markSize: number
  depth: number
  light: number
  shine: number
  contrast: number
  speed: number
  scale: number
  direction: number
}

export interface PatternWavesProps extends Partial<PresetValues> {
  preset?: SurfacePreset
  color?: string
  backgroundColor?: string
  opacity?: number
  fade?: FadeKind
  fadeSize?: number
  characters?: string
  interactive?: boolean
  cursorSize?: number
  cursorStrength?: number
  intro?: boolean
  paused?: boolean
  className?: string
  style?: CSSProperties
}

const SURFACE_PRESETS: Record<SurfacePreset, PresetValues> = {
  silk: {
    pattern: 'dot',
    wave: 'silk',
    spacing: 9,
    markSize: 0.95,
    depth: 0.95,
    light: 0,
    shine: 0.8,
    contrast: 1.2,
    speed: 0.35,
    scale: 1,
    direction: 20,
  },
  ocean: {
    pattern: 'dot',
    wave: 'swell',
    spacing: 10,
    markSize: 0.9,
    depth: 0.42,
    light: 0,
    shine: 1,
    contrast: 1.2,
    speed: 0.5,
    scale: 1,
    direction: 100,
  },
  pond: {
    pattern: 'dot',
    wave: 'ripple',
    spacing: 10,
    markSize: 0.9,
    depth: 0.55,
    light: 0,
    shine: 1.2,
    contrast: 1.2,
    speed: 0.5,
    scale: 1,
    direction: 35,
  },
  lines: {
    pattern: 'line',
    wave: 'silk',
    spacing: 12,
    markSize: 0.42,
    depth: 0.9,
    light: 0,
    shine: 0.6,
    contrast: 1.2,
    speed: 0.3,
    scale: 1,
    direction: 20,
  },
  terminal: {
    pattern: 'glyph',
    wave: 'ripple',
    spacing: 13,
    markSize: 0.95,
    depth: 0.75,
    light: 0,
    shine: 0.9,
    contrast: 1.4,
    speed: 0.3,
    scale: 1.1,
    direction: 200,
  },
  mesh: {
    pattern: 'plus',
    wave: 'silk',
    spacing: 14,
    markSize: 0.8,
    depth: 0.95,
    light: 0,
    shine: 1,
    contrast: 1.45,
    speed: 0.4,
    scale: 1.1,
    direction: 325,
  },
}

const DEFAULT_CHARACTERS = '.:-=+*#%@'

const PatternWaves = ({
  preset = 'silk',
  pattern,
  wave,
  spacing,
  markSize,
  depth,
  light,
  shine,
  contrast,
  speed,
  scale,
  direction,
  color = '#ffffff',
  backgroundColor = '#000000',
  opacity = 1,
  fade = 'edges',
  fadeSize = 0.5,
  characters = DEFAULT_CHARACTERS,
  interactive = true,
  cursorSize = 50,
  cursorStrength = 0.6,
  intro = true,
  paused = false,
  className = '',
  style,
}: PatternWavesProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const postRef = useRef<((message: PatternCommand) => void) | null>(null)

  const settings = useMemo<PatternSettings>(() => {
    const base = SURFACE_PRESETS[preset] || SURFACE_PRESETS.silk
    const pick = <K extends keyof PresetValues>(value: PresetValues[K] | undefined, key: K): PresetValues[K] =>
      value === undefined || value === null ? base[key] : value
    return {
      color: parseColor(color, [1, 1, 1, 1]),
      background: parseColor(backgroundColor, [0, 0, 0, 1]),
      pattern: pick(pattern, 'pattern'),
      wave: pick(wave, 'wave'),
      spacing: pick(spacing, 'spacing'),
      markSize: pick(markSize, 'markSize'),
      depth: pick(depth, 'depth'),
      light: pick(light, 'light'),
      shine: pick(shine, 'shine'),
      contrast: pick(contrast, 'contrast'),
      speed: pick(speed, 'speed'),
      scale: pick(scale, 'scale'),
      direction: pick(direction, 'direction'),
      opacity,
      fade,
      fadeSize,
      characters,
      interactive,
      cursorSize,
      cursorStrength,
      intro,
      paused,
    }
  }, [
    preset,
    pattern,
    wave,
    spacing,
    markSize,
    depth,
    light,
    shine,
    contrast,
    speed,
    scale,
    direction,
    color,
    backgroundColor,
    opacity,
    fade,
    fadeSize,
    characters,
    interactive,
    cursorSize,
    cursorStrength,
    intro,
    paused,
  ])
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const canvas = document.createElement('canvas')
    canvas.className = 'block h-full w-full'
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
    const thread = launchGlThread(
      new URL('./gl/patternWaves.worker.ts', import.meta.url),
      canvas,
      snapshot,
      'pattern-waves',
      (node) => startPatternEngine({ ...snapshot, canvas: node }),
    )
    postRef.current = thread.post
    const unbind = bindGlSurface(container, thread.post)
    return () => {
      postRef.current = null
      unbind()
      thread.dispose()
      canvas.remove()
    }
  }, [])

  useEffect(() => {
    postRef.current?.({ type: 'settings', settings })
  }, [settings])

  return <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`.trim()} style={style} />
}

export default PatternWaves
