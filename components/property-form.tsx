'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '@/lib/store'
import type { Property } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PropertyFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: Property | null
}

function toLines(value: string): string[] {
  return value
    .split('\n')
    .map((v) => v.trim())
    .filter(Boolean)
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function PropertyForm({ open, onOpenChange, editing }: PropertyFormProps) {
  const { addProperty, updateProperty } = useStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [ref, setRef] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [features, setFeatures] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState('')

  // Sincroniza o formulário quando abre para adicionar/editar
  const [lastKey, setLastKey] = useState<string | null>(null)
  const key = `${open}-${editing?.id ?? 'new'}`
  if (open && key !== lastKey) {
    setLastKey(key)
    setTitle(editing?.title ?? '')
    setRef(editing?.ref ?? '')
    setPrice(editing ? String(editing.price) : '')
    setDescription(editing?.description ?? '')
    setFeatures(editing?.features.join('\n') ?? '')
    setPhotos(editing?.photos ?? [])
    setVideoUrl(editing?.videoUrl ?? '')
  }

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (files.length === 0) {
      toast.error('Selecione arquivos de imagem (JPEG ou PNG).')
      return
    }
    try {
      const urls = await Promise.all(files.map(readFileAsDataUrl))
      setPhotos((prev) => [...prev, ...urls])
    } catch {
      toast.error('Não foi possível carregar uma das imagens.')
    }
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !ref.trim()) {
      toast.error('Preencha ao menos título e código de referência.')
      return
    }
    const priceNum = Number(price)
    if (!priceNum || priceNum <= 0) {
      toast.error('Informe um valor de aluguel válido.')
      return
    }

    const data = {
      title: title.trim(),
      ref: ref.trim(),
      price: priceNum,
      description: description.trim(),
      features: toLines(features),
      photos,
      videoUrl: videoUrl.trim(),
    }

    if (editing) {
      updateProperty(editing.id, data)
      toast.success('Imóvel atualizado.')
    } else {
      addProperty({ ...data, availability: [] })
      toast.success('Imóvel adicionado.')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {editing ? 'Editar imóvel' : 'Novo imóvel'}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do imóvel de alto padrão.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="pf-title">Título</Label>
            <Input
              id="pf-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cobertura Duplex Vista Mar"
              className="focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pf-ref">Código (Ref)</Label>
              <Input
                id="pf-ref"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder="LX-104"
                className="focus-visible:border-primary focus-visible:ring-primary/30"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pf-price">Aluguel / mês (R$)</Label>
              <Input
                id="pf-price"
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="42000"
                className="focus-visible:border-primary focus-visible:ring-primary/30"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pf-desc">Descrição</Label>
            <Textarea
              id="pf-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Descreva o imóvel..."
              className="focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pf-features">Diferenciais (um por linha)</Label>
            <Textarea
              id="pf-features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              rows={4}
              placeholder={'4 suítes\n5 vagas de garagem\n480 m²'}
              className="focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </div>

          <div className="grid gap-2">
            <Label className="flex items-center gap-1">
              Fotos do Imóvel
              <span className="text-xs font-normal text-muted-foreground">
                (Carregar imagens JPEG/PNG da galeria)
              </span>
            </Label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files)
                e.target.value = ''
              }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-6 text-center transition hover:border-primary/70 hover:bg-primary/10"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Plus className="size-5" />
              </span>
              <span className="text-sm font-medium text-primary">
                Adicionar da Galeria
              </span>
              <span className="text-xs text-muted-foreground">
                Clique para selecionar uma ou mais imagens
              </span>
            </button>

            {photos.length > 0 && (
              <div className="mt-1 grid grid-cols-3 gap-2">
                {photos.map((src, i) => (
                  <div
                    key={`${src.slice(0, 24)}-${i}`}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src || '/placeholder.svg'}
                      alt={`Foto ${i + 1} do imóvel`}
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      aria-label={`Remover foto ${i + 1}`}
                      className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-brand-navy/90 text-brand-gold ring-1 ring-brand-gold/40 transition hover:bg-brand-navy"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length === 0 && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ImagePlus className="size-3.5" />
                Nenhuma foto adicionada ainda.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pf-video">Link do vídeo (YouTube)</Label>
            <Input
              id="pf-video"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editing ? 'Salvar alterações' : 'Adicionar imóvel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
