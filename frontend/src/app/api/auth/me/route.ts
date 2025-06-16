import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  userId: number;
}

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { userId } = jwtDecode<JwtPayload>(token);

    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.json();
      return NextResponse.json(
        { error: 'Falha ao buscar usuário no backend', details: errorData },
        { status: apiRes.status }
      );
    }

    const userData = await apiRes.json();
    return NextResponse.json(userData);

  } catch (e) {
    console.error('ERRO NA API /api/auth/me:', e);

    const message = e instanceof Error ? e.message : 'Ocorreu um erro inesperado.';
    return NextResponse.json({ error: 'Erro interno do servidor.', details: message }, { status: 500 });
  }
}