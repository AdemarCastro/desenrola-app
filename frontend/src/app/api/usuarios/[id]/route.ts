import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { Usuario } from "@/types/Usuario";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Recupera token do cookie de autenticação
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Lê dados do corpo da requisição
  const body = (await request.json()) as Usuario;

  // Encaminha PUT ao backend Express
  const apiResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${params.id}`,
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
  // Retorna resposta ao cliente Next
  return NextResponse.json(data, { status: apiResponse.status });
}
