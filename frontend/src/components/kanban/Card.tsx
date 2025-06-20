'use client'
import React, { DragEvent } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { Tarefa } from '@/types/tarefa'

interface Props {
  card: Tarefa
  isUpdating?: boolean
}

export default function Card({ card, isUpdating }: Props) {
  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData('cardId', card.id.toString())
    e.dataTransfer.effectAllowed = 'move'
  }

  const getPriorityColor = () => {
    switch (card.prioridade_id) {
      case 2: return 'border-l-red-500'
      case 3: return 'border-l-green-500'
      default: return 'border-l-blue-500'
    }
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`bg-white p-3 rounded shadow mb-3 relative border-l-4 ${getPriorityColor()}
        ${isUpdating ? 'opacity-70' : 'opacity-100 hover:shadow-md transition-shadow'}`}
    >
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
          <FaSpinner className="animate-spin text-blue-500 text-xl" />
        </div>
      )}
      
      <p className="font-medium mb-1">{card.descricao}</p>
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>
          {new Date(card.criado_em).toLocaleDateString('pt-BR')}
        </span>
        <span>
          {card.prioridade_id === 2 ? 'Alta' : 
           card.prioridade_id === 3 ? 'Baixa' : 'Normal'}
        </span>
      </div>
    </div>
  )
}