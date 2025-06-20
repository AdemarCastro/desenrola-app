'use client'
import React, { DragEvent } from 'react'
import Card from './Card'
import { Tarefa } from '@/types/tarefa'

interface Props {
  title: string
  column: string
  cards: Tarefa[]
  onDrop: (e: DragEvent<HTMLDivElement>) => void
  isUpdating: Record<number, boolean>
}

export default function Column({ title, cards, onDrop, isUpdating }: Props) {
  return (
    <div
      className="flex-1 bg-gray-50 p-4 rounded min-w-[250px] border shadow-sm"
      onDragOver={e => e.preventDefault()}
      onDrop={onDrop}
    >
      <h2 className="font-bold mb-3 text-gray-700">{title}</h2>
      {cards.length === 0 ? (
        <p className="text-gray-400 text-sm py-3 text-center">Nenhuma tarefa</p>
      ) : (
        cards.map(card => (
          <Card 
            key={card.id} 
            card={card} 
            isUpdating={isUpdating[card.id]} 
          />
        ))
      )}
    </div>
  )
}