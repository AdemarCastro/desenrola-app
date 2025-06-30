// src/app/api/tarefas/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { Tarefa } from "@/types/tarefa";

// Tipagem para o contexto do handler
interface RouteContext {
  params: { id: string };
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = context.params;
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
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
      return NextResponse.json(
        { error: "Token expirado ou inválido" },
        { status: 401 }
      );
    }

    const data = await apiResponse.json();
    return NextResponse.json(data, { status: apiResponse.status });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = context.params;
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tarefas/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (apiRes.status === 401) {
      return NextResponse.json(
        { error: "Token expirado ou inválido" },
        { status: 401 }
      );
    }
    if (apiRes.status === 204) {
      return NextResponse.json({}, { status: 200 });
    }

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
