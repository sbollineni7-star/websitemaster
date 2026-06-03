import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../supabaseClient'

const VISITOR_ID_STORAGE_KEY = 'sriBollineniVisitorId'
const LOCAL_VISITOR_COUNT_STORAGE_KEY = 'sriBollineniLocalVisitorCount'
const LOCAL_VISITOR_RECORDED_STORAGE_KEY = 'sriBollineniLocalVisitorRecorded'
const LAST_DISPLAY_COUNT_STORAGE_KEY = 'sriBollineniLastDisplayVisitorCount'
const DISPLAY_COUNT_PER_VISITOR = 10
const MIN_COUNTER_ANIMATION_MS = 1200
const MAX_COUNTER_ANIMATION_MS = 4200
const TRACKED_CLICK_SELECTOR = 'button, a[href], [role="button"]'

function createVisitorId() {
  if (typeof window.crypto?.randomUUID === 'function') {
    return window.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getVisitorId() {
  const savedVisitorId = window.localStorage.getItem(VISITOR_ID_STORAGE_KEY)

  if (savedVisitorId) {
    return savedVisitorId
  }

  const visitorId = createVisitorId()
  window.localStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId)
  return visitorId
}

function getVisitorCountFromResponse(data: unknown) {
  const row = Array.isArray(data) ? data[0] : data

  if (!row || typeof row !== 'object') {
    return null
  }

  const totalVisitors = Number((row as { total_visitors?: number | string }).total_visitors)

  return Number.isFinite(totalVisitors) ? totalVisitors : null
}

function getStoredNumber(storageKey: string) {
  const storedValue = Number(window.localStorage.getItem(storageKey))

  return Number.isFinite(storedValue) && storedValue >= 0 ? storedValue : null
}

function normalizeVisitorCount(visitorCount: number) {
  return Math.max(0, Math.ceil(visitorCount))
}

function toDisplayCount(visitorCount: number) {
  return normalizeVisitorCount(visitorCount) * DISPLAY_COUNT_PER_VISITOR
}

function getStoredLocalVisitorCount() {
  return getStoredNumber(LOCAL_VISITOR_COUNT_STORAGE_KEY)
}

function getStoredDisplayCount() {
  return getStoredNumber(LAST_DISPLAY_COUNT_STORAGE_KEY)
}

function getInitialDisplayCount() {
  const storedDisplayCount = getStoredDisplayCount()

  if (storedDisplayCount !== null) {
    return storedDisplayCount
  }

  const storedVisitorCount = getStoredLocalVisitorCount()

  return storedVisitorCount === null ? null : toDisplayCount(storedVisitorCount)
}

function getMinimumStoredVisitorCount() {
  const storedVisitorCount = getStoredLocalVisitorCount() ?? 0
  const storedDisplayCount = getStoredDisplayCount()
  const storedDisplayVisitorCount = storedDisplayCount === null ? 0 : Math.ceil(storedDisplayCount / DISPLAY_COUNT_PER_VISITOR)

  return Math.max(storedVisitorCount, storedDisplayVisitorCount)
}

function storeVisitorCount(visitorCount: number) {
  const nextCount = Math.max(normalizeVisitorCount(visitorCount), getMinimumStoredVisitorCount())

  window.localStorage.setItem(LOCAL_VISITOR_COUNT_STORAGE_KEY, String(nextCount))
  window.localStorage.setItem(LOCAL_VISITOR_RECORDED_STORAGE_KEY, 'true')

  return nextCount
}

function storeDisplayCount(displayCount: number) {
  window.localStorage.setItem(LAST_DISPLAY_COUNT_STORAGE_KEY, String(Math.max(0, Math.round(displayCount))))
}

function recordLocalVisitorCount() {
  const currentCount = getStoredLocalVisitorCount() ?? 0
  const wasRecorded = window.localStorage.getItem(LOCAL_VISITOR_RECORDED_STORAGE_KEY) === 'true'
  const nextCount = wasRecorded ? Math.max(currentCount, 1) : currentCount + 1

  return storeVisitorCount(nextCount)
}

function recordLocalCounterClick() {
  const currentCount = getStoredLocalVisitorCount() ?? 0
  const nextCount = currentCount + 1

  return storeVisitorCount(nextCount)
}

function getTrackedClickTarget(eventTarget: EventTarget | null) {
  if (!(eventTarget instanceof Element)) {
    return null
  }

  const clickableElement = eventTarget.closest(TRACKED_CLICK_SELECTOR)

  if (!clickableElement || clickableElement.closest('.visitor-counter')) {
    return null
  }

  if (clickableElement instanceof HTMLButtonElement && clickableElement.disabled) {
    return null
  }

  if (clickableElement.getAttribute('aria-disabled') === 'true') {
    return null
  }

  return clickableElement
}

export default function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState<number | null>(() => {
    const storedVisitorCount = getMinimumStoredVisitorCount()

    return storedVisitorCount > 0 ? storedVisitorCount : null
  })
  const [displayVisitorCount, setDisplayVisitorCount] = useState<number | null>(() => getInitialDisplayCount())
  const displayVisitorCountRef = useRef(displayVisitorCount)
  const animationFrameRef = useRef<number | null>(null)

  const updateVisitorCount = useCallback((nextVisitorCount: number) => {
    const storedVisitorCount = storeVisitorCount(nextVisitorCount)

    setVisitorCount((currentCount) =>
      currentCount === null ? storedVisitorCount : Math.max(currentCount, storedVisitorCount),
    )
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadVisitorCount() {
      try {
        const visitorId = getVisitorId()

        if (typeof supabase.rpc === 'function') {
          const { data, error } = await supabase.rpc('record_site_visit', {
            p_visitor_key: visitorId,
          })

          if (error) {
            throw error
          }

          const sharedVisitorCount = getVisitorCountFromResponse(data)

          if (sharedVisitorCount !== null) {
            if (isMounted) {
              updateVisitorCount(sharedVisitorCount)
            }

            return
          }
        }
      } catch (error) {
        console.warn('Visitor counter is using local fallback:', error)
      }

      const localVisitorCount = recordLocalVisitorCount()

      if (isMounted) {
        updateVisitorCount(localVisitorCount)
      }
    }

    loadVisitorCount()

    return () => {
      isMounted = false
    }
  }, [updateVisitorCount])

  useEffect(() => {
    if (visitorCount === null) {
      return undefined
    }

    const targetDisplayCount = toDisplayCount(visitorCount)
    const savedDisplayCount = getStoredDisplayCount()
    const currentDisplayCount = displayVisitorCountRef.current ?? savedDisplayCount ?? Math.max(targetDisplayCount - DISPLAY_COUNT_PER_VISITOR, 0)
    const startDisplayCount = Math.min(currentDisplayCount, targetDisplayCount)

    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current)
    }

    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (shouldReduceMotion || startDisplayCount >= targetDisplayCount) {
      displayVisitorCountRef.current = targetDisplayCount
      setDisplayVisitorCount(targetDisplayCount)
      storeDisplayCount(targetDisplayCount)
      return undefined
    }

    displayVisitorCountRef.current = startDisplayCount
    setDisplayVisitorCount(startDisplayCount)

    const countDifference = targetDisplayCount - startDisplayCount
    const duration = Math.min(MAX_COUNTER_ANIMATION_MS, Math.max(MIN_COUNTER_ANIMATION_MS, countDifference * 45))
    let animationStartTime: number | null = null

    const animateCounter = (timestamp: number) => {
      animationStartTime ??= timestamp

      const elapsed = timestamp - animationStartTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - (1 - progress) ** 3
      const nextDisplayCount = Math.round(startDisplayCount + countDifference * easedProgress)

      displayVisitorCountRef.current = nextDisplayCount
      setDisplayVisitorCount(nextDisplayCount)

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(animateCounter)
        return
      }

      storeDisplayCount(targetDisplayCount)
      animationFrameRef.current = null
    }

    animationFrameRef.current = window.requestAnimationFrame(animateCounter)

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [visitorCount])

  useEffect(() => {
    let isMounted = true
    const recordSharedCounterClick = async () => {
      if (typeof supabase.rpc !== 'function') {
        return
      }

      const { data, error } = await supabase.rpc('record_site_visit', {
        p_visitor_key: `${getVisitorId()}-click-${createVisitorId()}`,
      })

      if (error) {
        throw error
      }

      const sharedVisitorCount = getVisitorCountFromResponse(data)

      if (sharedVisitorCount !== null && isMounted) {
        updateVisitorCount(sharedVisitorCount)
      }
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (!getTrackedClickTarget(event.target)) {
        return
      }

      const localClickCount = recordLocalCounterClick()

      setVisitorCount((currentCount) => {
        const nextVisitorCount = currentCount === null ? localClickCount : Math.max(currentCount + 1, localClickCount)

        return storeVisitorCount(nextVisitorCount)
      })

      void recordSharedCounterClick().catch((error) => {
        console.warn('Visitor counter click is using local fallback:', error)
      })
    }

    document.addEventListener('click', handleDocumentClick, true)

    return () => {
      isMounted = false
      document.removeEventListener('click', handleDocumentClick, true)
    }
  }, [updateVisitorCount])

  return (
    <div className="visitor-counter" aria-live="polite">
      <span>Visitors</span>
      <strong>{displayVisitorCount === null ? '...' : displayVisitorCount.toLocaleString()}</strong>
    </div>
  )
}
