'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { getVideoEmbedData } from '@/lib/format'

export function VideoTour({ url, title }: { url: string; title: string }) {
  const [active, setActive] = useState(false)
  const data = getVideoEmbedData(url)

  if (!data) return null

  const { provider, embedUrl, thumbUrl } = data
  const previewSrc = thumbUrl ?? '/placeholder.svg'
  const overlayLabel = provider === 'instagram' ? 'Vídeo Instagram' : 'Tour Virtual'

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-card">
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl}
          title={`${overlayLabel} — ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={`Reproduzir ${overlayLabel.toLowerCase()} de ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt=""
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-background/40 transition group-hover:bg-background/25" />
          <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/60 bg-background/70 backdrop-blur-sm transition group-hover:scale-105">
            <Play className="size-6 translate-x-0.5 fill-primary text-primary" />
          </span>
          <span className="absolute bottom-4 left-4 text-sm font-medium tracking-wide text-foreground">
            {overlayLabel}
          </span>
        </button>
      )}
    </div>
  )
}
