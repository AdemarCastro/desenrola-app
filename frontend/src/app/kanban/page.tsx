import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import KanbanBoard from '@/components/KanbanBoard';
import { Projeto } from '@/types/projeto';
import { Tarefa } from '@/types/tarefa';

async function fetchProjetos(token: string): Promise<Projeto[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (res.status === 401) redirect('/login');
  if (!res.ok) throw new Error('Erro ao buscar projetos');
  const json = await res.json();
  // API pode retornar array direto ou objeto com { data: [] }
  return Array.isArray(json) ? json : json.data;
}

async function fetchTarefas(token: string, projetoId?: string): Promise<Tarefa[]> {
  const url = projetoId
    ? `${process.env.NEXT_PUBLIC_API_URL}/projetos/${projetoId}/tarefas`
    : `${process.env.NEXT_PUBLIC_API_URL}/tarefas`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (res.status === 401) redirect('/login');
  if (!res.ok) throw new Error('Erro ao buscar tarefas');
  return res.json();
}

export default async function KanbanPage({ searchParams }: { searchParams: { projetoId?: string } }) {
  const token = (await cookies()).get('token')?.value;
  if (!token) redirect('/login');
  let projetos: Projeto[];
  let tarefas: Tarefa[];
  try {
    projetos = await fetchProjetos(token);
    tarefas = await fetchTarefas(token, searchParams.projetoId);
  } catch (err) {
    return (
      <div className="p-4 bg-white text-black min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Kanban</h1>
        <p className="text-red-500 text-sm mb-4">Erro: {err instanceof Error ? err.message : 'desconhecido'}</p>
      </div>
    );
  }
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 bg-white text-black overflow-auto">
          <KanbanBoard projetos={projetos} tarefas={tarefas} projetoId={searchParams.projetoId} token={token} />
        </main>
      </div>
    </div>
  );
}
