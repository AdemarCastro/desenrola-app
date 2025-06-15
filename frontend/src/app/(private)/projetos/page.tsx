import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Projeto } from '@/types/projeto';
import { ProjetosClientUI } from '@/components/ProjetosClient';

async function fetchProjetos(token: string | undefined): Promise<Projeto[] | { error: string }> {
  if (!token) {
    redirect('/login');
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (res.status === 401) {
      redirect('/login');
    }

    if (!res.ok) {
      throw new Error('Erro ao buscar projetos da API');
    }

    const response = await res.json();
    return response.data;

  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro desconhecido ao carregar projetos';
    console.error(message);
    return { error: message };
  }
}


export default async function ProjetosPage() {
  const token = (await cookies()).get('token')?.value;
  const projetosOuErro = await fetchProjetos(token);

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Projetos</h1>

      { 'error' in projetosOuErro ? (
        <p className="text-red-500 text-sm">Erro: {projetosOuErro.error}</p>
      ) : (
        <ProjetosClientUI projetos={projetosOuErro} />
      )}
    </div>
  );
}