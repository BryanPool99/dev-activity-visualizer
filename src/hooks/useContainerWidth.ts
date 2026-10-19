import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/**
 * The width a container actually has, measured rather than assumed.
 *
 * A grid of 53 columns cannot know how much room it has until it is in the
 * page, and the answer changes with the window.
 */
export function useContainerWidth<T extends HTMLElement>(
  ref: RefObject<T | null>,
): number | null {
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const measure = () => setWidth(element.clientWidth)

    measure()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setWidth(entry.contentRect.width)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return width
}
