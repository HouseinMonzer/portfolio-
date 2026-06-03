import { useEffect, useState } from 'react'

export function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [display, setDisplay] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex % words.length]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplay(current.slice(0, display.length + 1))
          if (display.length + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), pause)
          }
        } else {
          setDisplay(current.slice(0, display.length - 1))
          if (display.length - 1 === 0) {
            setIsDeleting(false)
            setWordIndex((i) => i + 1)
          }
        }
      },
      isDeleting ? speed / 2 : speed,
    )

    return () => clearTimeout(timeout)
  }, [display, isDeleting, wordIndex, words, speed, pause])

  return display
}
