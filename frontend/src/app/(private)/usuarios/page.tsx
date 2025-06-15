import { cookies } from 'next/headers';
import { Usuario } from "@/types/Usuario";
import UserTable from "@/components/UserTable";
import { redirect } from 'next/navigation';

async function fetchUsuarios(token: string | undefined) {
  if (!token) {
    redirect('/login');
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store', 
    });

    if (res.status === 401) {
      redirect('/login');
    }

    if (!res.ok) throw new Error("Erro ao buscar usuários");
    
    return await res.json();
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erro desconhecido";
    return { error: message };
  }
}

export default async function UsuariosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const data: Usuario[] | { error: string } = await fetchUsuarios(token);

  if ('error' in data) {
    return (
      <div className="p-4 bg-white text-black min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuário</h1>
        <p className="text-red-500 text-sm">Erro: {data.error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuário</h1>
      <UserTable usuarios={data} />
    </div>
  );
}