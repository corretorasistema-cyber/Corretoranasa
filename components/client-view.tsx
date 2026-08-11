'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { useStore } from '@/lib/store'
import { PropertyDetail } from '@/components/property-detail'

export function ClientView() {
  const { properties, ready } = useStore()
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (properties.length === 0) {
      setActiveId(null)
      return
    }
    if (!activeId || !properties.some((p) => p.id === activeId)) {
      setActiveId(properties[0].id)
    }
  }, [properties, activeId])

  const active = properties.find((p) => p.id === activeId) ?? null

  if (!ready) {
    return (
      <div className="py-24 text-center text-sm text-muted-foreground">
        Carregando portfólio...
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-24 text-center text-sm text-muted-foreground">
        Nenhum imóvel cadastrado. Acesse o Painel do Admin para adicionar.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {properties.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {properties.map((p) => {
            const isActive = p.id === activeId
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveId(p.id)}
                className={cn(
                  'group relative flex w-56 shrink-0 flex-col overflow-hidden rounded-xl border text-left transition',
                  isActive
                    ? 'border-primary'
                    : 'border-border hover:border-primary/50',
                )}
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={p.photos[0] || '/placeholder.svg'}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="224px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <div className="p-3">
                  <span className="font-mono text-[10px] tracking-widest text-primary">
                    {p.ref}
                  </span>
                  <p className="mt-0.5 truncate font-serif text-sm">
                    {p.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatCurrency(p.price)}/mês
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {active && <PropertyDetail key={active.id} property={active} />}
    </div>
  )
}
