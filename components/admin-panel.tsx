'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Pencil, Plus, RotateCcw, Trash2, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/format'
import { useStore } from '@/lib/store'
import type { Property } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { PropertyForm } from '@/components/property-form'
import { SlotManager } from '@/components/slot-manager'

interface AdminPanelProps {
  onLogout?: () => void
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const { properties, ready, removeProperty, resetSeed } = useStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Property | null>(null)

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (p: Property) => {
    setEditing(p)
    setFormOpen(true)
  }

  const handleDelete = (p: Property) => {
    removeProperty(p.id)
    toast.success(`"${p.title}" removido.`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl">Gestão de imóveis</h2>
          <p className="text-sm text-muted-foreground">
            Cadastre imóveis e defina a agenda de visitas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              resetSeed()
              toast.success('Exemplos restaurados.')
            }}
          >
            <RotateCcw className="size-4" />
            Restaurar exemplos
          </Button>
          <Button onClick={openNew}>
            <Plus className="size-4" />
            Adicionar imóvel
          </Button>
          {onLogout ? (
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          ) : null}
        </div>
      </div>

      {!ready ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Carregando...
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          Nenhum imóvel cadastrado.
        </div>
      ) : (
        <div className="grid gap-5">
          {properties.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-2xl border border-border bg-card/50"
            >
              <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center">
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg sm:w-40">
                  <Image
                    src={p.photos[0] || '/placeholder.svg'}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[10px] tracking-widest text-primary">
                    {p.ref}
                  </span>
                  <h3 className="truncate font-serif text-lg">{p.title}</h3>
                  <p className="text-sm text-primary">
                    {formatCurrency(p.price)}
                    <span className="text-muted-foreground">/mês</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(p)}
                  >
                    <Pencil className="size-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(p)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Agenda de visitas
                </h4>
                <SlotManager property={p} />
              </div>
            </div>
          ))}
        </div>
      )}

      <PropertyForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
      />
    </div>
  )
}
