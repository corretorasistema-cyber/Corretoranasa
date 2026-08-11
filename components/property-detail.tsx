'use client'

import { Check } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import type { Property } from '@/lib/types'
import { PhotoCarousel } from '@/components/photo-carousel'
import { VideoTour } from '@/components/video-tour'
import { Scheduling } from '@/components/scheduling'

export function PropertyDetail({ property }: { property: Property }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
      <div className="flex flex-col gap-6">
        <PhotoCarousel photos={property.photos} title={property.title} />
        <VideoTour url={property.videoUrl} title={property.title} />
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <span className="inline-block rounded-full border border-primary/40 px-3 py-1 font-mono text-xs tracking-widest text-primary">
            REF {property.ref}
          </span>
          <h2 className="mt-3 text-balance font-serif text-3xl leading-tight sm:text-4xl">
            {property.title}
          </h2>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-primary">
              {formatCurrency(property.price)}
            </span>
            <span className="text-sm text-muted-foreground">/ mês</span>
          </div>
        </div>

        <p className="text-pretty leading-relaxed text-muted-foreground">
          {property.description}
        </p>

        <div>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Diferenciais
          </h3>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {property.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <Check className="size-4 shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Scheduling property={property} />
      </div>
    </div>
  )
}
