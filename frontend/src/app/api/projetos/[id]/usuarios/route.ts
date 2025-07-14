import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

interface BackendUser {
  usuario: {
    id: number;
    primeiro_nome: string;
    sobrenome: string;
  };
  nivelAcesso: {
    id: number;
    nome: string;
  };
  projeto: {
    id: number;
    nome: string;
  };
}

interface UsuariosResponse {
  error?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // aguarda a resolução de params para extrair id
  const { id: projectId } = await params;

  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

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
    
    if (!apiRes.ok) {
      const result = (await apiRes.json()) as UsuariosResponse;
      return NextResponse.json(
        { error: result.error || 'Falha ao buscar usuários' },
        { status: apiRes.status }
      );
    }

    const backendUsers = (await apiRes.json()) as BackendUser[];
    
    // Mapeia para o formato esperado pelo frontend
    const users = backendUsers.map(item => ({
      id: item.usuario.id.toString(),
      nome: `${item.usuario.primeiro_nome} ${item.usuario.sobrenome}`
    }));

    return NextResponse.json(users);

  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro inesperado no servidor.';
    console.error(`ERRO NA API /api/projetos/${projectId}/usuarios:`, e);
    return NextResponse.json(
      { error: 'Erro interno do servidor.', details: message },
      { status: 500 }
    );
  }
}
