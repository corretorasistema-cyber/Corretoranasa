const WHATSAPP_NUMBER = '5565996717310'

const MONTHS_PT = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

const WEEKDAYS_SHORT_PT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY' (sem problemas de fuso)
export function formatDateBR(key: string): string {
  const [y, m, d] = key.split('-')
  return `${d}/${m}/${y}`
}

// 'YYYY-MM-DD' -> 'quinta, 12 de junho'
export function formatDateLong(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const weekday = WEEKDAYS_SHORT_PT[date.getDay()]
  return `${weekday}, ${d} de ${MONTHS_PT[m - 1]}`
}

export function monthLabel(year: number, monthIndex: number): string {
  return `${MONTHS_PT[monthIndex]} de ${year}`
}

export function buildWhatsappUrl(params: {
  title: string
  ref: string
  date: string
  time: string
  name?: string
}): string {
  const signature = params.name?.trim() ? params.name.trim() : '[Seu Nome]'
  const message = `Olá NASA IMOB! Desejo confirmar agendamento para o Imóvel ${params.ref}. Data: ${formatDateBR(params.date)} às ${params.time}. Favor confirmar disponibilidade. Atenciosamente, ${signature}.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export type VideoEmbedData = {
  provider: 'youtube' | 'instagram'
  embedUrl: string
  id: string
  thumbUrl?: string
}

export function getVideoEmbedData(url: string): VideoEmbedData | null {
  if (!url) return null
  const trimmed = url.trim()

  const youtubeId = getYoutubeId(trimmed)
  if (youtubeId) {
    return {
      provider: 'youtube',
      id: youtubeId,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`,
      thumbUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    }
  }

  const instagram = getInstagramMedia(trimmed)
  if (instagram) {
    return {
      provider: 'instagram',
      id: instagram.id,
      embedUrl: `https://www.instagram.com/${instagram.type}/${instagram.id}/embed/?cr=1&v=12`,
    }
  }

  return null
}

function getInstagramMedia(url: string): { type: 'p' | 'reel' | 'tv'; id: string } | null {
  const match = url.match(/(?:instagram\.com|instagr\.am)\/(p|reel|tv)\/([^/?#&]+)/i)
  if (!match) return null
  const [, type, id] = match
  return {
    type: type as 'p' | 'reel' | 'tv',
    id,
  }
}

// Extrai o ID de um vídeo do YouTube de diversos formatos de URL
export function getYoutubeId(url: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ]
  for (const p of patterns) {
    const match = url.match(p)
    if (match) return match[1]
  }
  if (/^[\w-]{11}$/.test(url)) return url
  return null
}
