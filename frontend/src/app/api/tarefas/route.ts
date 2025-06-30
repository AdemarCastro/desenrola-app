// src/app/api/tarefas/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { Tarefa } from "@/types/tarefa";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body: Partial<Tarefa> = await request.json();
    
    // Atualiza apenas o status se for o único campo enviado
    const updateData = body.status_id 
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}