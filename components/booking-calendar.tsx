'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { monthLabel } from '@/lib/format'
import type { DayAvailability } from '@/lib/types'

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function pad(n: number) {
  return String(n).padStart(2, '0')
}

interface BookingCalendarProps {
  availability: DayAvailability[]
  selectedDate: string | null
  onSelect: (date: string) => void
}

export function BookingCalendar({
  availability,
  selectedDate,
  onSelect,
}: BookingCalendarProps) {
  const availableDates = useMemo(() => {
    const set = new Set<string>()
    for (const day of availability) {
      if (day.slots.some((s) => s.status === 'available')) set.add(day.date)
    }
    return set
  }, [availability])

  const firstAvailable = useMemo(() => {
    const sorted = [...availableDates].sort()
    return sorted[0]
  }, [availableDates])

  const initial = firstAvailable
    ? new Date(Number(firstAvailable.slice(0, 4)), Number(firstAvailable.slice(5, 7)) - 1, 1)
    : new Date()

  const [view, setView] = useState({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  })

  const grid = useMemo(() => {
    const first = new Date(view.year, view.month, 1)
    const startDay = first.getDay()
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
    const cells: (string | null)[] = []
    for (let i = 0; i < startDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(`${view.year}-${pad(view.month + 1)}-${pad(d)}`)
    }
    return cells
  }, [view])

  const changeMonth = (dir: number) => {
    setView((v) => {
      const m = v.month + dir
      if (m < 0) return { year: v.year - 1, month: 11 }
      if (m > 11) return { year: v.year + 1, month: 0 }
      return { year: v.year, month: m }
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          aria-label="Mês anterior"
          className="rounded-md border border-border p-1.5 text-muted-foreground transition hover:text-primary"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-medium capitalize tracking-wide">
          {monthLabel(view.year, view.month)}
        </span>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Próximo mês"
          className="rounded-md border border-border p-1.5 text-muted-foreground transition hover:text-primary"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w, i) => (
          <div
            key={i}
            className="py-1 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((key, i) => {
          if (!key) return <div key={i} />
          const day = Number(key.slice(8, 10))
          const hasSlots = availableDates.has(key)
          const isSelected = key === selectedDate
          return (
            <button
              key={key}
              type="button"
              disabled={!hasSlots}
              onClick={() => onSelect(key)}
              className={cn(
                'relative flex aspect-square items-center justify-center rounded-md text-sm transition',
                isSelected && 'bg-primary font-semibold text-primary-foreground',
                !isSelected &&
                  hasSlots &&
                  'text-foreground hover:bg-secondary',
                !hasSlots && 'text-muted-foreground/40',
              )}
            >
              {day}
              {hasSlots && !isSelected && (
                <span className="absolute bottom-1 size-1 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
