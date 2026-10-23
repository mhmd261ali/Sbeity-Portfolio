import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { checkRateLimit } from './rateLimit'

describe('rate limit', () => {
  it('blocks the sixth attempt inside the window', () => {
    const store = new Map<string, number[]>()
    const now = 1_000_000
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(checkRateLimit(store, '1.1.1.1', now + attempt)).toBe(true)
    }
    expect(checkRateLimit(store, '1.1.1.1', now + 6)).toBe(false)
    expect(checkRateLimit(store, '1.1.1.1', now + 16 * 60 * 1000)).toBe(true)
  })
})

describe('content model', () => {
  it('does not define a price field', () => {
    const dir = path.resolve('sanity/schemas')
    const source = readdirSync(dir)
      .filter((file) => file.endsWith('.ts'))
      .map((file) => readFileSync(path.join(dir, file), 'utf8'))
      .join('\n')
    expect(source).not.toMatch(/name:\s*['"]price['"]/)
    expect(source).not.toMatch(/title:\s*['"]السعر['"]/)
  })
})
