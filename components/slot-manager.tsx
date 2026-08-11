'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { formatDateLong } from '@/lib/format'
import { useStore } from '@/lib/store'
import type { Property } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SlotManager({ property }: { property: Property }) {
  const { addSlot, removeSlot, toggleSlot } = useStore()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const handleAdd = () => {
    if (!date) {
      toast.error('Selecione uma data.')
      return
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
      toast.error('Informe um horário válido (ex: 14:30).')
      return
    }
    addSlot(property.id, date, time)
    setTime('')
    toast.success(`Horário ${time} adicionado.`)
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-background/40 p-3">
        <div className="grid gap-1.5">
          <Label htmlFor={`date-${property.id}`} className="text-xs">
            Dia livre
          </Label>
          <Input
            id={`date-${property.id}`}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-[9.5rem]"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`time-${property.id}`} className="text-xs">
            Horário
          </Label>
          <Input
            id={`time-${property.id}`}
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-[7.5rem]"
          />
        </div>
        <Button type="button" size="sm" onClick={handleAdd}>
          <Plus className="size-4" />
          Adicionar
        </Button>
      </div>

      {property.availability.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum horário cadastrado para este imóvel.
        </p>
      ) : (
        <div className="grid gap-3">
          {property.availability.map((day) => (
            <div key={day.date} className="rounded-lg border border-border p-3">
              <p className="mb-2 text-sm font-medium capitalize">
                {formatDateLong(day.date)}
              </p>
              <div className="flex flex-wrap gap-2">
                {day.slots.map((slot) => {
                  const booked = slot.status === 'booked'
                  return (
                    <div
                      key={slot.time}
                      className={cn(
                        'flex items-center gap-1.5 rounded-md border py-1 pl-2.5 pr-1 text-sm',
                        booked
                          ? 'border-destructive/40 text-muted-foreground'
                          : 'border-primary/40 text-foreground',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          toggleSlot(property.id, day.date, slot.time)
                        }
                        title={
                          booked
                            ? 'Marcar como disponível'
                            : 'Marcar como ocupado'
                        }
                        className="flex items-center gap-1.5"
                      >
                        <span
                          className={cn(
                            'size-2 rounded-full',
                            booked ? 'bg-destructive' : 'bg-primary',
                          )}
                        />
                        {slot.time}
                        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          {booked ? 'ocupado' : 'livre'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          removeSlot(property.id, day.date, slot.time)
                        }
                        aria-label={`Remover horário ${slot.time}`}
                        className="rounded p-0.5 text-muted-foreground transition hover:text-destructive"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
