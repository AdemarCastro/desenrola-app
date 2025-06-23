import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const projectId = context.params.id;
    const body = await request.json();
    
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await apiRes.json();
    if (!apiRes.ok) {
      console.error('Erro ao atualizar projeto:', data);
      return NextResponse.json(
        { error: data.error || 'Falha ao atualizar projeto' },
        { status: apiRes.status }
      );
    }
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro inesperado no servidor.';
    console.error('ERRO NA API /api/projetos/[id]:', e);
    return NextResponse.json(
      { error: 'Erro interno do servidor.', details: message },
      { status: 500 }
    );
  }
}