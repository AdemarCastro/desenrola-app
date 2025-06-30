import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nome, descricao } = body;

    if (!nome || typeof nome !== "string") {
      return NextResponse.json(
        { error: "O nome do projeto é obrigatório e deve ser uma string." },
        { status: 400 }
      );
    }

    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome, descricao }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      console.error("Erro ao criar projeto:", data);
      return NextResponse.json(
        { error: data.error || "Falha ao criar projeto" },
        { status: apiRes.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Erro inesperado no servidor.";
    console.error("ERRO NA API /api/projetos:", e);
    return NextResponse.json(
      { error: "Erro interno do servidor.", details: message },
      { status: 500 }
    );
  }
}
