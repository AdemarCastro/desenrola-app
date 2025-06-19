import React, { DragEvent } from 'react'
import { Tarefa } from '@/types/tarefa'
import Card from './Card'
import AddCard, { mapColumnToStatus } from './AddCard'

interface Props {
  title: string
  column: Tarefa['status_id'] extends number ? string : string
  cards: Tarefa[]
  setCards: React.Dispatch<React.SetStateAction<Tarefa[]>>
  projetoId?: number
  projects: { id: number; nome: string }[]
}

const Column: React.FC<Props> = ({
  title,
  column,
  cards,
  setCards,
  projetoId,
  projects,
}) => {
  // filtra só as tarefas desta coluna
  const columnCards = cards.filter((c) => c.status_id === mapColumnToStatus(column))
  
  // função para tratar drop e atualizar status da tarefa
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('cardId')
    const status_id = mapColumnToStatus(column)
    // atualiza no backend
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tarefas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status_id }),
    })
    // atualiza estado local
    setCards(prev => prev.map(c => c.id.toString() === id ? { ...c, status_id } : c))
  }
   
  return (
    <div
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      className="flex-1 bg-white rounded p-3 flex flex-col"
    >
      <h2 className="font-semibold mb-2 flex justify-between items-center">
        {title} <span className="text-sm bg-supportlight-grey rounded-full px-2">{columnCards.length}</span>
      </h2>

      <div className="flex-1 space-y-2 overflow-auto">
        {columnCards.map((card) => {
          const projeto = projects.find((p) => p.id === card.id_projeto)
          return (
            <Card
              key={card.id}
              card={card}
              projectName={projeto?.nome}
            />
          )
        })}
      </div>

      {/* só permite adicionar se um projeto estiver selecionado */}
      {projetoId && (
        <AddCard
          column={column}
          projetoId={projetoId}
          setCards={setCards}
        />
      )}
    </div>
  )
}

export default Column