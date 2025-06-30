// src/app/api/tarefas/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { Tarefa } from "@/types/tarefa";

// Função utilitária para extrair o id da URL
function getIdFromRequest(request: NextRequest): string | null {
  const match = request.nextUrl.pathname.match(/\/tarefas\/([^\/]+)$/);
  return match ? match[1] : null;
}

// Atualiza tarefa
export async function PUT(request: NextRequest): Promise<NextResponse> {
  const id = getIdFromRequest(request);
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body: Partial<Tarefa> = await request.json();
  const updateData = body.status_id != null
    ? { status_id: body.status_id }
    : body;

  const apiResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tarefas/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    }
  );

  if (apiResponse.status === 401) {
    return NextResponse.json({ error: "Token expirado ou inválido" }, { status: 401 });
  }
  if (!apiResponse.ok) {
    const err = await apiResponse.json();
    return NextResponse.json(
      { error: err.error || "Falha ao atualizar tarefa" },
      { status: apiResponse.status }
    );
  }

  const data = await apiResponse.json();
  return NextResponse.json(data, { status: 200 });
}

// Exclui tarefa
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const id = getIdFromRequest(request);
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const apiResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tarefas/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (apiResponse.status === 401) {
    return NextResponse.json({ error: "Token expirado ou inválido" }, { status: 401 });
  }
  if (apiResponse.status === 204) {
    return NextResponse.json({ message: "Tarefa deletada" }, { status: 200 });
  }
  if (!apiResponse.ok) {
    const err = await apiResponse.json();
    return NextResponse.json(
      { error: err.error || "Falha ao deletar tarefa" },
      { status: apiResponse.status }
    );
  }

  const data = await apiResponse.json();
  return NextResponse.json(data, { status: 200 });
}
