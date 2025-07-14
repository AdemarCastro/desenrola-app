import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

interface UsuariosResponse {
  data: { id: string; nome: string }[];
  error?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const projectId = params.id;
  if (!projectId) {
    return NextResponse.json({ error: 'ID do projeto é obrigatório' }, { status: 400 });
  }

  try {
    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projetos/${projectId}/usuarios`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }
    );
    const result = (await apiRes.json()) as UsuariosResponse;

    if (!apiRes.ok) {
      return NextResponse.json(
        { error: result.error || 'Falha ao buscar usuários' },
        { status: apiRes.status }
      );
    }

    return NextResponse.json(result.data);

  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro inesperado no servidor.';
    console.error(`ERRO NA API /api/projetos/${projectId}/usuarios:`, e);
    return NextResponse.json(
      { error: 'Erro interno do servidor.', details: message },
      { status: 500 }
    );
  }
}
