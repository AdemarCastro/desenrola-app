'use client'
import React, { useCallback } from 'react'
import { useKanban } from '@/hooks/useKanban'
import Column from './Column'
import BurnBarrel from './BurnBarrel'
import { Projeto } from '@/types/projeto'
import { Tarefa } from '@/types/tarefa'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  projetoId?: number
  projects: Projeto[]
  initialCards: Tarefa[]
}

const statusMap: Record<string, number> = {
  backlog: 1,
  todo: 2,
  doing: 3,
  done: 4
}

export default function KanbanBoard({ projetoId, projects, initialCards }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const { 
    cards, 
    updateCardStatus, 
    confirmStatusUpdate,
    isUpdating
  } = useKanban(projetoId, initialCards)

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProjetoId = e.target.value === 'all' ? undefined : Number(e.target.value)
    const params = new URLSearchParams(searchParams.toString())
    
    if (newProjetoId) {
      params.set('projetoId', newProjetoId.toString())
    } else {
      params.delete('projetoId')
    }
    
    router.push(`/kanban?${params.toString()}`)
  }

  const handleDrop = useCallback(async (
    e: React.DragEvent<HTMLDivElement>, 
    statusKey: string
  ) => {
    e.preventDefault()
    const cardId = e.dataTransfer.getData('cardId')
    const newStatusId = statusMap[statusKey]
    
    if (!cardId || !newStatusId) return
    
    updateCardStatus(Number(cardId), newStatusId)
    await confirmStatusUpdate(Number(cardId), newStatusId)
  }, [updateCardStatus, confirmStatusUpdate])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2 font-medium">Projeto:</label>
          <select
            value={projetoId || 'all'}
            onChange={handleProjectChange}
            className="p-2 border rounded"
          >
            <option value="all">Todos os Projetos</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.entries(statusMap).map(([statusKey, statusId]) => (
          <Column
            key={statusKey}
            title={statusKey.toUpperCase()}
            column={statusKey}
            cards={cards.filter(c => c.status_id === statusId)}
            onDrop={(e) => handleDrop(e, statusKey)}
            isUpdating={isUpdating}
          />
        ))}
        <BurnBarrel />
      </div>
    </div>
  )
}