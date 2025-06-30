//frontend\src\app\(private)\kanban\page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import KanbanBoard from '@/components/KanbanBoard';
import { Tarefa } from '@/types/tarefa';

async function fetchTarefas(token: string): Promise<Tarefa[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tarefas`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (res.status === 401) redirect('/login');
  if (!res.ok) throw new Error('Erro ao buscar tarefas');
  return res.json();
}

export default async function KanbanPage() {
  const token = (await cookies()).get('token')?.value;
  if (!token) redirect('/login');
  let tarefas: Tarefa[];
  try {
    tarefas = await fetchTarefas(token);
  } catch (err) {
    return (
      <div className="p-4 bg-white text-black min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Kanban</h1>
        <p className="text-red-500 text-sm mb-4">
          Erro: {err instanceof Error ? err.message : 'desconhecido'}
        </p>
      </div>
    );
  }

  return (
    <main className="h-screen p-4 bg-white text-black overflow-auto">
      <KanbanBoard
        tarefas={tarefas}
      />
    </main>
  );
}
