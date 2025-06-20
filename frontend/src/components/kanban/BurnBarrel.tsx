'use client'
import React, { useState, DragEvent } from 'react'
import { FaTrash, FaFire } from 'react-icons/fa'

export default function BurnBarrel() {
  const [active, setActive] = useState(false)

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setActive(true)
  }
  
  const handleDragLeave = () => setActive(false)
  
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('cardId')
    setActive(false)
    await fetch(`/api/tarefas/${id}`, { method: 'DELETE' })
    // Atualização da UI deve ser feita via contexto ou refetch
  }

  return (
    <div
      className={`w-16 h-16 flex items-center justify-center rounded-lg
        ${active ? 'bg-red-800 text-white' : 'bg-gray-200 text-gray-500'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {active ? <FaFire size={24} /> : <FaTrash size={20} />}
    </div>
  )
}