import React from 'react'
import { useKanban } from '@/hooks/useKanban'
import Column from './Column'
import BurnBarrel from './BurnBarrel'
import { Projeto } from '@/types/projeto'
import { Tarefa } from '@/types/tarefa'

interface Props {
  projetoId?: number
  projects: Projeto[]
}

const columns: { key: keyof Tarefa; title: string }[] = [
  { key: 'descricao', title: 'Backlog' },
  { key: 'descricao', title: 'ToDo' },
  { key: 'descricao', title: 'Doing' },
  { key: 'descricao', title: 'Done' },
]

const KanbanBoard: React.FC<Props> = ({ projetoId, projects }) => {
  const { cards, setCards, loading, error } = useKanban(projetoId)

  if (loading) return <p>Carregando tarefas...</p>
  if (error) return <p className="text-red-600">Erro: {error}</p>

  return (
    <div className="flex gap-4">
      <Column
        title="Backlog"
        column="backlog"
        cards={cards}
        setCards={setCards}
        projetoId={projetoId}
        projects={projects}
      />
      <Column
        title="ToDo"
        column="todo"
        cards={cards}
        setCards={setCards}
        projetoId={projetoId}
        projects={projects}
      />
      <Column
        title="Doing"
        column="doing"
        cards={cards}
        setCards={setCards}
        projetoId={projetoId}
        projects={projects}
      />
      <Column
        title="Done"
        column="done"
        cards={cards}
        setCards={setCards}
        projetoId={projetoId}
        projects={projects}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  )
}

export default KanbanBoard