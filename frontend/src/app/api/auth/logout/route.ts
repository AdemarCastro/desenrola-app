import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    (await cookies()).set({
      name: 'token',
      value: '',
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    });

    return NextResponse.json({ success: true });

  } catch (e) {
    console.error('ERRO NA API /api/auth/logout:', e);

    const message = e instanceof Error ? e.message : 'Ocorreu um erro inesperado.';
    return NextResponse.json({ error: 'Erro interno do servidor.', details: message }, { status: 500 });
  }
}