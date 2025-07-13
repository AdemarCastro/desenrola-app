import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

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
    const body = await apiRes.json();
    if (!apiRes.ok) {
      return NextResponse.json(
        { error: body.error || 'Falha ao buscar usuários' },
        { status: apiRes.status }
      );
    }

    // body.data pode ser o array de usuários ou um wrapper
    const rawList = body.data ?? body;
    const users = (Array.isArray(rawList) ? rawList : []).map((item: any) => {
      const u = item.usuario ?? item;
      return {
        id: u.id.toString(),
        nome: u.nome ?? `${u.primeiro_nome} ${u.sobrenome}`
      };
    });
    return NextResponse.json(users);
  } catch (e) {
    console.error(`ERRO NA API /api/projetos/${projectId}/usuarios:`, e);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
