import React from 'react'
import { Tarefa } from '@/types/tarefa'

interface Props {
  card: Tarefa
  projectName?: string
}

const Card: React.FC<Props> = ({ card, projectName }) => {
  return (
    <div className="p-2 bg-supportwhite-grey rounded shadow-sm">
      <div>{card.descricao}</div>
      {projectName && (
        <div className="mt-1 text-xs text-fgmuted">
          Projeto: {projectName}
        </div>
      )}
    </div>
  )
}

export default Card