'use client'
import React, { DragEvent } from 'react'
import { Tarefa } from '@/types/tarefa'
import { FaSpinner } from 'react-icons/fa'

interface Props {
  card: Tarefa
  isUpdating?: boolean
}

export default function Card({ card, isUpdating }: Props) {
  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData('cardId', card.id.toString())
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`bg-white p-3 rounded shadow cursor-grab relative
        ${isUpdating ? 'opacity-70' : 'opacity-100'}`}
    >
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
          <FaSpinner className="animate-spin text-blue-500" />
        </div>
      )}
      {/* use 'descricao' em vez de 'texto' */}
      <h3 className="font-medium">{card.descricao}</h3>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          {card.id_projeto ? `Projeto #${card.id_projeto}` : 'Sem projeto'}
        </span>
        {/* use 'criado_em' em vez de 'data_criacao' */}
        <span className="text-xs text-gray-500">
          {new Date(card.criado_em).toLocaleDateString('pt-BR')}
        </span>
      </div>
    </div>
  )
}