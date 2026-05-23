'use client'

import { useEffect, type RefObject } from 'react'

type SeekableVideo = HTMLVideoElement & { fastSeek?: (t: number) => void }

function seekTo(video: SeekableVideo, time: number) {
  if (typeof video.fastSeek === 'function') {
    video.fastSeek(time)
  } else {
    video.currentTime = time
  }
}

export function useScrollVideo(
  containerRef: RefObject<HTMLDivElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
) {
  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return

    // Respect reduced-motion: skip scroll-scrubbing entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId: number
    let targetTime = 0
    let isSeeking = false

    function loop() {
      rafId = requestAnimationFrame(loop)
      const v = videoRef.current as SeekableVideo | null
      if (!v || isSeeking) return
      if (Math.abs(v.currentTime - targetTime) < 0.001) return
      isSeeking = true
      seekTo(v, targetTime)
    }

    function onSeeked() {
      isSeeking = false
    }

    function onScroll() {
      const v = videoRef.current
      const c = containerRef.current
      if (!v || !c) return
      const rect = c.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)))
      targetTime = progress * (v.duration || 0)
    }

    const el = video

    function init() {
      el.addEventListener('seeked', onSeeked)
      window.addEventListener('scroll', onScroll, { passive: true })
      rafId = requestAnimationFrame(loop)
    }
    if (el.readyState >= 1) {
      init()
    } else {
      el.addEventListener('loadedmetadata', init, { once: true })
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      el.removeEventListener('seeked', onSeeked)
      el.removeEventListener('loadedmetadata', init)
    }
  }, [containerRef, videoRef])
}
