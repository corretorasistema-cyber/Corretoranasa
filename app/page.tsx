'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Building2, LayoutDashboard, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StoreProvider } from '@/lib/store'
import { ClientView } from '@/components/client-view'
import { AdminPanel } from '@/components/admin-panel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toaster } from '@/components/ui/sonner'

type View = 'client' | 'admin'

const ADMIN_STORAGE_KEY = 'nasa-admin-auth'

export default function Page() {
  const [view, setView] = useState<View>('client')
  const [adminAuth, setAdminAuth] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    const isAuthenticated = window.localStorage.getItem(ADMIN_STORAGE_KEY) === 'true'
    if (isAuthenticated) {
      setAdminAuth(true)
      setView('admin')
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(ADMIN_STORAGE_KEY, String(adminAuth))
  }, [adminAuth])

  const handleAdminLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setLoginError(result.message ?? 'E-mail ou senha incorretos.')
        return
      }

      setAdminAuth(true)
      setLoginError('')
      setEmail('')
      setPassword('')
      setView('admin')
    } catch (_error) {
      setLoginError('Não foi possível entrar no painel administrativo.')
    }
  }

  const handleAdminLogout = () => {
    setAdminAuth(false)
    setView('client')
    setLoginError('')
    setEmail('')
    setPassword('')
  }

  const adminContent = adminAuth ? (
    <AdminPanel onLogout={handleAdminLogout} />
  ) : (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card/70 p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-serif">Login do Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Use seu e-mail e senha para acessar o painel administrativo.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecione Painel do Admin no topo para abrir o formulário de login.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleAdminLogin}>
        <div className="space-y-2">
          <Label htmlFor="admin-email">E-mail</Label>
          <Input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Seu e-mail administrativo"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Senha</Label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Sua senha administrativa"
            required
          />
        </div>
        {loginError ? (
          <p className="text-sm text-destructive">{loginError}</p>
        ) : null}
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </div>
  )

  return (
    <StoreProvider>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40">
          {/* Barra de marca (azul-marinho) */}
          <div className="bg-brand-navy text-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="relative size-11 shrink-0 overflow-hidden rounded-full ring-1 ring-brand-gold/40 sm:size-14">
                  <Image
                    src="/nasa-imob-emblem.png"
                    alt="Logo NASA Imob"
                    fill
                    sizes="56px"
                    className="object-cover"
                    priority
                  />
                </span>
                <div className="flex flex-col leading-none">
                  <span className="font-serif text-base tracking-[0.15em] text-brand-gold sm:text-xl">
                    NASA IMOB
                  </span>
                  <span className="mt-1 text-[9px] uppercase tracking-[0.22em] text-white/70 sm:text-[10px]">
                    Inteligência Imobiliária
                  </span>
                  <span className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-brand-gold/70 sm:text-[10px]">
                    CRECI: J 14.140
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end text-right">
                <span className="hidden text-sm font-medium text-white sm:block">
                  Portfólio de Luxo
                </span>
                <a
                  href="tel:+5565996717310"
                  className="mt-0.5 flex items-center gap-1.5 text-xs text-brand-gold sm:text-sm"
                >
                  <Phone className="size-3.5" />
                  (65) 99671-7310
                </a>
              </div>
            </div>
          </div>

          {/* Barra de navegação (grafite) */}
          <div className="border-b border-border bg-background/85 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-end px-4 py-2.5 sm:px-6">
              <div className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1">
                <ToggleButton
                  active={view === 'client'}
                  onClick={() => setView('client')}
                  icon={<Building2 className="size-4" />}
                  label="Imóveis"
                />
                <ToggleButton
                  active={view === 'admin'}
                  onClick={() => setView('admin')}
                  icon={<LayoutDashboard className="size-4" />}
                  label="Painel do Admin"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          {view === 'client' ? (
            <>
              <div className="mb-8 max-w-2xl">
                <h1 className="text-balance font-serif text-3xl leading-tight sm:text-4xl">
                  Residências de exceção, selecionadas a dedo
                </h1>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                  Explore nossa curadoria de imóveis de alto padrão para locação
                  e agende uma visita privada no horário que preferir.
                </p>
              </div>
              <ClientView />
              <div className="mt-10 rounded-3xl border border-border bg-card/50 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Para acessar o painel administrativo, clique em Painel do Admin no topo.
                </p>
                <Button onClick={() => setView('admin')} className="mx-auto">
                  Acessar o Login do Admin
                </Button>
              </div>
            </>
          ) : (
            adminContent
          )}
        </main>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-muted-foreground sm:px-6">
            NASA Imob — Portfólio de Luxo · CRECI: J 14.140 · (65) 99671-7310.
            Protótipo de demonstração.
          </div>
        </footer>

        <Toaster position="top-center" />
      </div>
    </StoreProvider>
  )
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition sm:text-sm',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      <span className="inline">{label}</span>
    </button>
  )
}
