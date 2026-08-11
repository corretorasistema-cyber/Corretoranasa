export type SlotStatus = 'available' | 'booked'

export interface TimeSlot {
  time: string
  status: SlotStatus
}

export interface DayAvailability {
  date: string // YYYY-MM-DD
  slots: TimeSlot[]
}

export interface Property {
  id: string
  title: string
  ref: string
  price: number
  description: string
  features: string[]
  photos: string[]
  videoUrl: string
  availability: DayAvailability[]
}
