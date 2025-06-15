import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json({ error: data.error || 'Falha na autenticação' }, { status: apiRes.status });
    }

    const { token } = data;

    (await cookies()).set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });

    return NextResponse.json({ success: true });

  } catch (e) {
    console.error('ERRO NA API DE LOGIN:', e);

    const message = e instanceof Error ? e.message : 'Ocorreu um erro inesperado.';
    return NextResponse.json({ error: 'Erro interno do servidor.', details: message }, { status: 500 });
  }
}