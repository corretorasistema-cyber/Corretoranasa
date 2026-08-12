import { NextResponse } from 'next/server'

// Use environment variables if set, otherwise use defaults
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? 'admin@nasaimob.com.br').trim().toLowerCase()
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? 'nasa2026').trim()

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (String(email ?? '').trim().toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json(
        {
          success: false,
          message: 'E-mail ou senha incorretos.',
        },
        { status: 401 },
      )
    }

    if (String(password ?? '') !== ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          message: 'E-mail ou senha incorretos.',
        },
        { status: 401 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Não foi possível validar as credenciais do painel administrativo.',
      },
      { status: 400 },
    )
  }
}
