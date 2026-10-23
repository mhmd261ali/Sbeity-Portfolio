export function checkRateLimit(
  store: Map<string, number[]>,
  key: string,
  now: number,
  limit = 5,
  windowMs = 15 * 60 * 1000,
) {
  const recent = (store.get(key) ?? []).filter((stamp) => now - stamp < windowMs)
  if (recent.length >= limit) {
    store.set(key, recent)
    return false
  }
  recent.push(now)
  store.set(key, recent)
  return true
}
