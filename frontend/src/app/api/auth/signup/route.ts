import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { primeiro_nome, sobrenome, email, senha } = await request.json();

    if (!primeiro_nome || !sobrenome || !email || !senha) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const backendPayload = {
      email,
      senha,
      primeiro_nome,
      sobrenome,
      data_nascimento: "1990-01-01",
    };

    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendPayload),
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.json();
      return NextResponse.json({ error: errorData.message || 'Falha ao criar usuário.' }, { status: apiRes.status });
    }

    const newUser = await apiRes.json();
    return NextResponse.json(newUser, { status: 201 });

  } catch (e) {
    console.error('ERRO NA API /api/auth/signup:', e);
    const message = e instanceof Error ? e.message : 'Ocorreu um erro inesperado.';
    return NextResponse.json({ error: 'Erro interno do servidor.', details: message }, { status: 500 });
  }
}