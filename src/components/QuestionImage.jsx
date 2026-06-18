import { useState, useEffect } from 'react'

export default function QuestionImage({ filename, alt, className }) {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/uploads/${filename}`)
        if (!res.ok) throw new Error('Failed')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        if (!cancelled) setSrc(url)
      } catch { /* loading failed silently */ }
    }
    load()
    return () => { cancelled = true }
  }, [filename])

  if (!src) return null
  return <img src={src} alt={alt || 'Question image'} className={className} />
}
