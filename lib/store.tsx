'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { DayAvailability, Property } from './types'

const STORAGE_KEY = 'maison-privee:properties:v1'

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

// Gera disponibilidade relativa à data atual para o protótipo.
function seedAvailability(offsets: number[], times: string[]): DayAvailability[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return offsets.map((offset) => {
    const d = new Date(today)
    d.setDate(d.getDate() + offset)
    return {
      date: toDateKey(d),
      slots: times.map((time) => ({ time, status: 'available' as const })),
    }
  })
}

function buildSeed(): Property[] {
  return [
    {
      id: 'lx-104',
      title: 'Cobertura Duplex Vista Mar',
      ref: 'LX-104',
      price: 42000,
      description:
        'Cobertura duplex com acabamento impecável e vista panorâmica para o mar. Ambientes integrados, iluminação natural abundante e uma varanda gourmet com piscina privativa de borda infinita. Um refúgio contemporâneo no ponto mais nobre da orla.',
      features: [
        '4 suítes',
        '5 vagas de garagem',
        '480 m² privativos',
        'Piscina privativa',
        'Varanda gourmet',
        'Vista panorâmica para o mar',
      ],
      photos: [
        '/properties/lx104-1.png',
        '/properties/lx104-2.png',
        '/properties/lx104-3.png',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      availability: seedAvailability(
        [1, 2, 3, 5, 7],
        ['10:00', '14:30', '17:00'],
      ),
    },
    {
      id: 'lx-207',
      title: 'Mansão Contemporânea Jardins',
      ref: 'LX-207',
      price: 68000,
      description:
        'Residência assinada por escritório premiado, com arquitetura de linhas puras e pé-direito duplo. Integração perfeita entre interior e áreas verdes, espelho d’água e um projeto de iluminação cênico. Sofisticação absoluta no coração dos Jardins.',
      features: [
        '6 suítes',
        '8 vagas de garagem',
        '920 m² de área construída',
        'Spa e sauna privativos',
        'Adega climatizada',
        'Jardim projetado',
      ],
      photos: [
        '/properties/lx207-1.png',
        '/properties/lx207-2.png',
        '/properties/lx207-3.png',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      availability: seedAvailability(
        [2, 3, 4, 6, 8],
        ['10:00', '14:30', '17:00'],
      ),
    },
  ]
}

interface StoreContextValue {
  properties: Property[]
  ready: boolean
  addProperty: (p: Omit<Property, 'id'>) => void
  updateProperty: (id: string, patch: Partial<Property>) => void
  removeProperty: (id: string) => void
  toggleSlot: (propertyId: string, date: string, time: string) => void
  addSlot: (propertyId: string, date: string, time: string) => void
  removeSlot: (propertyId: string, date: string, time: string) => void
  resetSeed: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setProperties(JSON.parse(raw))
      } else {
        const seed = buildSeed()
        setProperties(seed)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
      }
    } catch {
      setProperties(buildSeed())
    }
    setReady(true)
  }, [])

  const persist = useCallback((next: Property[]) => {
    setProperties(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  }, [])

  const addProperty = useCallback(
    (p: Omit<Property, 'id'>) => {
      const id = `lx-${Date.now().toString(36)}`
      persist([...properties, { ...p, id }])
    },
    [properties, persist],
  )

  const updateProperty = useCallback(
    (id: string, patch: Partial<Property>) => {
      persist(properties.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    },
    [properties, persist],
  )

  const removeProperty = useCallback(
    (id: string) => {
      persist(properties.filter((p) => p.id !== id))
    },
    [properties, persist],
  )

  const mutateSlots = useCallback(
    (
      propertyId: string,
      date: string,
      fn: (slots: Property['availability'][number]['slots']) => Property['availability'][number]['slots'],
    ) => {
      persist(
        properties.map((p) => {
          if (p.id !== propertyId) return p
          const hasDay = p.availability.some((a) => a.date === date)
          const availability = hasDay
            ? p.availability.map((a) =>
                a.date === date ? { ...a, slots: fn(a.slots) } : a,
              )
            : [...p.availability, { date, slots: fn([]) }]
          // remove dias sem horários e ordena
          const cleaned = availability
            .filter((a) => a.slots.length > 0)
            .sort((a, b) => a.date.localeCompare(b.date))
          return { ...p, availability: cleaned }
        }),
      )
    },
    [properties, persist],
  )

  const toggleSlot = useCallback(
    (propertyId: string, date: string, time: string) => {
      mutateSlots(propertyId, date, (slots) =>
        slots.map((s) =>
          s.time === time
            ? { ...s, status: s.status === 'available' ? 'booked' : 'available' }
            : s,
        ),
      )
    },
    [mutateSlots],
  )

  const addSlot = useCallback(
    (propertyId: string, date: string, time: string) => {
      mutateSlots(propertyId, date, (slots) => {
        if (slots.some((s) => s.time === time)) return slots
        return [...slots, { time, status: 'available' as const }].sort((a, b) =>
          a.time.localeCompare(b.time),
        )
      })
    },
    [mutateSlots],
  )

  const removeSlot = useCallback(
    (propertyId: string, date: string, time: string) => {
      mutateSlots(propertyId, date, (slots) =>
        slots.filter((s) => s.time !== time),
      )
    },
    [mutateSlots],
  )

  const resetSeed = useCallback(() => {
    persist(buildSeed())
  }, [persist])

  return (
    <StoreContext.Provider
      value={{
        properties,
        ready,
        addProperty,
        updateProperty,
        removeProperty,
        toggleSlot,
        addSlot,
        removeSlot,
        resetSeed,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore deve ser usado dentro de StoreProvider')
  return ctx
}
