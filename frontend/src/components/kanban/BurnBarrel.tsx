'use client'
import React, { useState, DragEvent } from 'react'
import { FaTrash, FaFire } from 'react-icons/fa'

export default function BurnBarrel() {
  const [active, setActive] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setActive(true)
  }

  const handleDragLeave = () => {
    setActive(false)
  }

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    const cardId = e.dataTransfer.getData('cardId')
    setActive(false)
    
    try {
      const res = await fetch(`/api/tarefas/${cardId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      
      if (!res.ok) {
        throw new Error('Falha ao excluir tarefa')
      }
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error)
    }
  }

  return (
    <div
      className={`mt-10 w-16 h-16 flex items-center justify-center rounded-lg
        transition-colors ${
          active
            ? 'bg-red-800 text-white'
            : 'bg-gray-200 text-gray-500'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {active ? <FaFire size={24} /> : <FaTrash size={24} />}
    </div>
  )
}