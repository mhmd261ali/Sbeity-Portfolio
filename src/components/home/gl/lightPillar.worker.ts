import { startLightEngine, type LightCommand, type LightInit } from './lightPillarEngine'

self.postMessage({ type: 'ready' })

interface InitMessage extends LightInit {
  type: 'init'
}

type WorkerMessage = InitMessage | LightCommand | { type: 'dispose' }

let thread: ReturnType<typeof startLightEngine> | null = null

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data
  if (!message || typeof message !== 'object') return
  if (message.type === 'init') {
    thread?.dispose()
    thread = startLightEngine({
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
