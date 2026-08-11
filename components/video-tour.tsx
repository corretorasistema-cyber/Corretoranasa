'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { getYoutubeId } from '@/lib/format'

export function VideoTour({ url, title }: { url: string; title: string }) {
  const [active, setActive] = useState(false)
  const id = getYoutubeId(url)

  if (!id) return null

  const thumb = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-card">
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title={`Tour virtual — ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={`Reproduzir tour virtual de ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb || '/placeholder.svg'}
            alt=""
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-background/40 transition group-hover:bg-background/25" />
          <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/60 bg-background/70 backdrop-blur-sm transition group-hover:scale-105">
            <Play className="size-6 translate-x-0.5 fill-primary text-primary" />
          </span>
          <span className="absolute bottom-4 left-4 text-sm font-medium tracking-wide text-foreground">
            Tour Virtual
          </span>
        </button>
      )}
    </div>
  )
}
