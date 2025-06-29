import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Projeto } from '@/types/projeto';
import { CronogramaClientUI } from '@/components/CronogramaClienteUI';

async function getProjetos(token: string): Promise<Projeto[] | { error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (res.status === 401) {
      redirect('/login');
    }
    if (!res.ok) {
      throw new Error('Falha ao buscar projetos da API');
    }
    const data = await res.json();
    return data.data;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro desconhecido';
    console.error("Erro em getProjetos:", message);
    return { error: message };
  }
}

export default async function CronogramaPage() {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const projetosResult = await getProjetos(token);

  if ('error' in projetosResult) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Cronograma</h1>
        <p className="text-red-500">Não foi possível carregar os projetos: {projetosResult.error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 h-full">
      <CronogramaClientUI projetos={projetosResult} />
    </div>
  );
}
