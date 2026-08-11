'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhotoCarouselProps {
  photos: string[]
  title: string
}

export function PhotoCarousel({ photos, title }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0)
  const count = photos.length

  if (count === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
        Sem fotos disponíveis
      </div>
    )
  }

  const go = (dir: number) => setIndex((i) => (i + dir + count) % count)

  return (
    <div className="group relative w-full overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
        <Image
          src={photos[index] || '/placeholder.svg'}
          alt={`${title} — foto ${index + 1} de ${count}`}
          fill
          priority={index === 0}
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/70 p-2 text-foreground backdrop-blur-sm transition hover:bg-background hover:text-primary"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/70 p-2 text-foreground backdrop-blur-sm transition hover:bg-background hover:text-primary"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para foto ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === index
                    ? 'w-6 bg-primary'
                    : 'w-1.5 bg-foreground/40 hover:bg-foreground/70',
                )}
              />
            ))}
          </div>

          <div className="absolute right-3 top-3 rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            {index + 1} / {count}
          </div>
        </>
      )}
    </div>
  )
}
