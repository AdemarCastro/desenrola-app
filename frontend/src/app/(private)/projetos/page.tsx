import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Projeto } from '@/types/projeto';
import { Tarefa } from '@/types/tarefa';
import { ProjetosClientUI } from '@/components/ProjetosClientUI';

async function fetchProjetosComProgresso(token: string | undefined): Promise<Projeto[] | { error: string }> {
  if (!token) {
    redirect('/login');
  }

  try {
    const resProjetos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (resProjetos.status === 401) redirect('/login');
    if (!resProjetos.ok) throw new Error('Erro ao buscar projetos da API');

    const projetos: Projeto[] = (await resProjetos.json()).data;

    const promessasDeTarefas = projetos.map(p =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos/${p.id}/tarefas`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }).then(res => res.json())
    );

    const resultadosTarefas = await Promise.all(promessasDeTarefas);
    
    const projetosComProgresso = projetos.map((projeto, index) => {
      const tarefas: Tarefa[] = resultadosTarefas[index];
      const total = tarefas.length;
      const concluidas = tarefas.filter(t => t.status_id === 2).length;
      const progresso = total === 0 ? 0 : Math.round((concluidas / total) * 100);

      return { ...projeto, progresso };
    });

    return projetosComProgresso;

  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro desconhecido ao carregar projetos';
    console.error(message);
    return { error: message };
  }
}

export default async function ProjetosPage() {
  const token = (await cookies()).get('token')?.value;
  const projetosOuErro = await fetchProjetosComProgresso(token);

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Projetos</h1>

      {'error' in projetosOuErro ? (
        <p className="text-red-500 text-sm">Erro: {projetosOuErro.error}</p>
      ) : (
        <ProjetosClientUI projetosIniciais={projetosOuErro} />
      )}
    </div>
  );
}