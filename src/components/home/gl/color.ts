export type Rgba = [number, number, number, number]
export type Rgb = [number, number, number]

export function parseColor(value: string, fallback: Rgba): Rgba {
  try {
    const ctx = document.createElement('canvas').getContext('2d')
    if (!ctx) return fallback
    ctx.fillStyle = '#000000'
    ctx.fillStyle = value
    const resolved = ctx.fillStyle
    if (resolved.startsWith('#')) {
      const n = parseInt(resolved.slice(1), 16)
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1]
    }
    const parts = resolved.match(/[\d.]+/g)
    if (!parts || parts.length < 3) return fallback
    return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255, parts[3] ? Number(parts[3]) : 1]
  } catch {
    return fallback
  }
}

export function parseRgb(value: string, fallback: Rgb = [1, 1, 1]): Rgb {
  const [r, g, b] = parseColor(value, [fallback[0], fallback[1], fallback[2], 1])
  return [r, g, b]
}
