import { NextResponse } from 'next/server'

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase()
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? '').trim()

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          message: 'Credenciais do painel administrativo não configuradas.',
        },
        { status: 500 },
      )
    }

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
