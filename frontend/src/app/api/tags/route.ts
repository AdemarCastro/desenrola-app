import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const token = cookies().get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  
  try {
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const body = await apiRes.json();
    if (!apiRes.ok) {
      return NextResponse.json(
        { error: body.error || 'Falha ao buscar tags' },
        { status: apiRes.status }
      );
    }
    return NextResponse.json(body.data ?? body);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro inesperado no servidor.';
    console.error('ERRO NA API /api/tags:', e);
    return NextResponse.json(
      { error: 'Erro interno do servidor.', details: message },
      { status: 500 }
    );
  }
}
