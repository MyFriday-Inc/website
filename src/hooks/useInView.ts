import { useState, useEffect, useRef } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useInView(options: UseInViewOptions = {}) {
  const [isInView, setIsInView] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const ref = useRef<HTMLElement>(null)

  const {
    threshold = 0.1,
    rootMargin = '50px 0px',
    triggerOnce = true
  } = options

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // If triggerOnce and already triggered, don't observe
    if (triggerOnce && hasTriggered) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting
        setIsInView(isIntersecting)
        
        if (isIntersecting && triggerOnce) {
          setHasTriggered(true)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce, hasTriggered])

  return { ref, isInView, hasTriggered }
}

// Hook for progressive loading based on distance from viewport
export function useProgressiveLoad(loadDistance: number = 200) {
  const [shouldLoad, setShouldLoad] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || shouldLoad) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Load when element is within loadDistance pixels of viewport
        if (entry.boundingClientRect.top < window.innerHeight + loadDistance) {
          setShouldLoad(true)
        }
      },
      {
        rootMargin: `${loadDistance}px 0px`
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [loadDistance, shouldLoad])

  return { ref, shouldLoad }
}
