//frontend\src\app\(private)\kanban\page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Projeto } from '@/types/projeto';
import KanbanClientUI from '@/components/KanbanClientUI';

async function fetchProjetos(token: string): Promise<Projeto[] | { error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
    if (res.status === 401) redirect('/login');
    if (!res.ok) throw new Error('Erro ao buscar projetos');
    const data = await res.json();
    return data.data || data;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro desconhecido';
    return { error: msg };
  }
}

export default async function KanbanPage() {
  const token = (await cookies()).get('token')?.value;
  if (!token) redirect('/login');
  const projetosResult = await fetchProjetos(token);
  if ('error' in projetosResult) {
    return (
      <div className="p-4 bg-white text-black min-h-screen max-w-7xl mx-auto">
        <p className="text-red-500 text-sm mb-4">Erro: {projetosResult.error}</p>
      </div>
    );
  }
  return (
    <main className="h-screen overflow-auto bg-white text-black">
      <div className="max-w-7xl mx-auto p-4">
        <KanbanClientUI projetos={projetosResult} />
      </div>
    </main>
  );
}
