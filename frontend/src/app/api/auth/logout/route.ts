import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    (await cookies()).set({
      name: 'token',
      value: '',
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    });

    return NextResponse.json({ success: true });

  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}