import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

function getTarefaIdFromRequest(request: NextRequest): string | null {
  const match = request.nextUrl.pathname.match(/\/tarefas\/(\d+)\/responsaveis/);
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  const tarefaId = getTarefaIdFromRequest(request);
  if (!tarefaId) {
    return NextResponse.json({ error: "ID da tarefa inválido" }, { status: 400 });
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { usuarioIds } = body;

    const apiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tarefas/${tarefaId}/responsaveis`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuarioIds }),
      }
    );
    
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return NextResponse.json({ error: "Falha ao adicionar responsáveis", details: errorData }, { status: apiResponse.status });
    }

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: "Erro interno do servidor", details: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const tarefaId = getTarefaIdFromRequest(request);
  if (!tarefaId) {
    return NextResponse.json({ error: "ID da tarefa inválido" }, { status: 400 });
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { usuarioId } = body;

    const apiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tarefas/${tarefaId}/responsaveis`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuarioId }),
      }
    );

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return NextResponse.json({ error: "Falha ao remover responsável", details: errorData }, { status: apiResponse.status });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: "Erro interno do servidor", details: message }, { status: 500 });
  }
}