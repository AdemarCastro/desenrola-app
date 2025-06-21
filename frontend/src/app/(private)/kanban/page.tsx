import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import { Projeto } from '@/types/projeto'
import { Tarefa } from '@/types/tarefa'

export default async function KanbanPage({
  searchParams
}: {
  searchParams: { projetoId?: string }
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/login')

  const baseURL = process.env.NEXT_PUBLIC_API_URL!
  const projetoId = searchParams.projetoId ? Number(searchParams.projetoId) : undefined

  try {
    // Busca todos os projetos
    const projetosRes = await fetch(`${baseURL}/projetos`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    
    if (projetosRes.status === 401) redirect('/login')
    if (!projetosRes.ok) throw new Error('Falha ao buscar projetos')
    
    const projetosData = await projetosRes.json()
    const projetos: Projeto[] = projetosData.data || projetosData

    // Busca tarefas conforme filtro
    const path = projetoId 
      ? `/projetos/${projetoId}/tarefas` 
      : '/tarefas'
      
    const tasksRes = await fetch(`${baseURL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    
    if (tasksRes.status === 401) redirect('/login')
    if (!tasksRes.ok) throw new Error('Erro ao carregar tarefas')
    
    const tarefasData = await tasksRes.json()
    const tarefas: Tarefa[] = tarefasData.data || tarefasData

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
        <KanbanBoard 
          projetoId={projetoId}
          projects={projetos}
          initialCards={tarefas}
        />
      </div>
    )
  } catch (error) {
    console.error('Erro no KanbanPage:', error)
    return (
      <div className="p-4 text-red-500">
        Erro ao carregar dados do Kanban: {(error as Error).message}
      </div>
    )
  }
}