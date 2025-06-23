import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const projectId = context.params.id;
  if (!projectId) {
    return NextResponse.json({ error: 'ID do projeto é obrigatório' }, { status: 400 });
  }

  try {
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos/${projectId}/tarefas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      console.error('Erro ao buscar tarefas da API de backend:', data);
      return NextResponse.json(
        { error: data.error || 'Falha ao buscar tarefas' },
        { status: apiRes.status }
      );
    }

    return NextResponse.json(data);

  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro inesperado no servidor.';
    console.error(`ERRO NA API /api/projetos/${projectId}/tarefas:`, e);
    return NextResponse.json(
      { error: 'Erro interno do servidor.', details: message },
      { status: 500 }
    );
  }
}