import { startPatternEngine, type PatternCommand, type PatternInit } from './patternEngine'

self.postMessage({ type: 'ready' })

interface InitMessage extends PatternInit {
  type: 'init'
}

type WorkerMessage = InitMessage | PatternCommand | { type: 'dispose' }

let thread: ReturnType<typeof startPatternEngine> | null = null

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data
  if (!message || typeof message !== 'object') return
  if (message.type === 'init') {
    thread?.dispose()
    thread = startPatternEngine({
      canvas: message.canvas,
      width: message.width,
      height: message.height,
      dpr: message.dpr,
      reducedMotion: message.reducedMotion,
      hidden: message.hidden,
      settings: message.settings,
    })
    return
  }
  if (message.type === 'dispose') {
    thread?.dispose()
    thread = null
    return
  }
  thread?.post(message)
}
