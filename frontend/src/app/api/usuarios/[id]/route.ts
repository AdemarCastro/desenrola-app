import { NextResponse, NextRequest } from "next/server";
import type { Usuario } from "@/types/Usuario";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body: Usuario = await request.json();
  const apiResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );
  const data = await apiResponse.json();
  return NextResponse.json(data, { status: apiResponse.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const apiResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await apiResponse.json();
  return NextResponse.json(data, { status: apiResponse.status });
}