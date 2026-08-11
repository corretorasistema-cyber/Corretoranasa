'use client'

import { useMemo, useState } from 'react'
import { Calendar, Clock, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buildWhatsappUrl, formatDateLong } from '@/lib/format'
import type { Property } from '@/lib/types'
import { BookingCalendar } from '@/components/booking-calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Scheduling({ property }: { property: Property }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState('')

  const slots = useMemo(() => {
    if (!selectedDate) return []
    return (
      property.availability.find((a) => a.date === selectedDate)?.slots ?? []
    )
  }, [property.availability, selectedDate])

  const handleSelectDate = (date: string) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const canConfirm = Boolean(selectedDate && selectedTime)

  const whatsappUrl = canConfirm
    ? buildWhatsappUrl({
        title: property.title,
        ref: property.ref,
        date: selectedDate!,
        time: selectedTime!,
        name,
      })
    : '#'

  return (
    <div className="rounded-2xl border border-border bg-card/50 p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <Calendar className="size-4 text-primary" />
        <h3 className="font-serif text-xl">Agende sua visita privada</h3>
      </div>

      <div className="grid gap-5">
        <BookingCalendar
          availability={property.availability}
          selectedDate={selectedDate}
          onSelect={handleSelectDate}
        />

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            {selectedDate ? (
              <span className="capitalize">
                Horários para {formatDateLong(selectedDate)}
              </span>
            ) : (
              <span>Selecione uma data no calendário</span>
            )}
          </div>

          {selectedDate && (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => {
                const isBooked = slot.status === 'booked'
                const isSelected = slot.time === selectedTime
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedTime(slot.time)}
                    className={cn(
                      'rounded-lg border py-2.5 text-sm font-medium transition',
                      isSelected &&
                        'border-primary bg-primary text-primary-foreground',
                      !isSelected &&
                        !isBooked &&
                        'border-border text-foreground hover:border-primary/60 hover:text-primary',
                      isBooked &&
                        'cursor-not-allowed border-border/50 text-muted-foreground/40 line-through',
                    )}
                  >
                    {slot.time}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="visitor-name" className="flex items-center gap-1.5">
            <User className="size-3.5 text-primary" />
            Seu nome
          </Label>
          <Input
            id="visitor-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Como devemos te chamar?"
          />
        </div>

        {canConfirm ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-navy text-sm font-semibold text-brand-gold ring-1 ring-brand-gold/30 transition hover:bg-brand-navy/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-gold/40"
          >
            <MessageCircle className="size-5" />
            Confirmar Agendamento via WhatsApp
          </a>
        ) : (
          <span className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-brand-navy/50 text-sm font-semibold text-brand-gold/50 ring-1 ring-brand-gold/10">
            <MessageCircle className="size-5" />
            Confirmar Agendamento via WhatsApp
          </span>
        )}

        {!canConfirm && (
          <p className="-mt-2 text-center text-xs text-muted-foreground">
            Escolha uma data e um horário para habilitar a confirmação.
          </p>
        )}
      </div>
    </div>
  )
}
