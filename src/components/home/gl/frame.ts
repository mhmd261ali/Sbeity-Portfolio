export const requestFrame = (callback: FrameRequestCallback) => {
  if (typeof requestAnimationFrame === 'function') return requestAnimationFrame(callback)
  return setTimeout(() => callback(performance.now()), 16) as unknown as number
}

export const cancelFrame = (handle: number) => {
  if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(handle)
  else clearTimeout(handle)
}
