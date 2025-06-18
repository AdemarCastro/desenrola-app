import React from 'react'
import { Tarefa } from '@/types/tarefa'
import Card from './Card'
import AddCard from './AddCard'

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
  const columnCards = cards.filter((c) => c.status === column)

  return (
    <div className="flex-1 bg-white rounded p-3 flex flex-col">
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