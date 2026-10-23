import { useEffect, useRef, useState } from 'react'

export function IntroVideo({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)
  const [needsPlay, setNeedsPlay] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    void video.play().catch(() => setNeedsPlay(true))
  }, [])

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white">
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        <img src="/brand/logo.png" alt="" className="h-12 w-12" />
        <button type="button" onClick={onDone} className="min-h-11 rounded-full border border-line px-5 text-sm font-semibold text-blue">
          تخطّي المقدمة
        </button>
      </div>
      <div className="relative min-h-0 flex-1">
        <video
          ref={videoRef}
          className="h-full w-full bg-white object-contain"
          src="/intro.mp4"
          playsInline
          muted
          preload="auto"
          onTimeUpdate={(event) => {
            const video = event.currentTarget
            if (video.duration) setProgress(video.currentTime / video.duration)
          }}
          onEnded={onDone}
          onError={onDone}
        />
        {needsPlay && (
          <button
            type="button"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold px-6 py-3 font-semibold text-blue"
            onClick={() => {
              void videoRef.current?.play()
              setNeedsPlay(false)
            }}
          >
            تشغيل
          </button>
        )}
      </div>
      <div className="h-1.5 bg-foam" aria-hidden>
        <div className="h-full bg-gold" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  )
}
