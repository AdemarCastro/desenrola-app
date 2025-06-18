import React, { useState, DragEvent } from 'react'
import { FiTrash } from 'react-icons/fi'
import { FaFire } from 'react-icons/fa'
import { Tarefa } from '@/types/tarefa'

interface Props {
  setCards: React.Dispatch<React.SetStateAction<Tarefa[]>>
}

const BurnBarrel: React.FC<Props> = ({ setCards }) => {
  const [active, setActive] = useState(false)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('cardId')
    setCards((prev) => prev.filter((c) => c.id.toString() !== id))
    setActive(false)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setActive(true)
      }}
      onDragLeave={() => setActive(false)}
      onDrop={handleDrop}
      className={`w-[100px] h-[100px] flex items-center justify-center rounded border-2 
        ${active ? 'border-red-600 bg-red-100 text-red-600' : 'border-fgmuted text-fgmuted'}`}
    >
      {active ? <FaFire size={24} /> : <FiTrash size={24} />}
    </div>
  )
}

export default BurnBarrel