'use client'
import React, { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { Tarefa } from '@/types/tarefa'

interface Props {
  column: string
  projetoId: number
  setCards: React.Dispatch<React.SetStateAction<Tarefa[]>>
}

const AddCard: React.FC<Props> = ({ column, projetoId, setCards }) => {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tarefas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        descricao: text.trim(),
        status_id: mapColumnToStatus(column),
        prioridade_id: 1,
        id_projeto: projetoId // usa o projeto selecionado
      })
    })
    const nova: Tarefa = await res.json()
    setCards((prev) => [...prev, nova])
    setText('')
    setOpen(false)
  }

  return open ? (
    <form onSubmit={handleSubmit} className="space-y-1 mt-2">
      <textarea
        autoFocus
        className="w-full p-2 border border-supportlight-grey rounded bg-bgsubtle"
        placeholder="Nova tarefa…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-fgmuted"
        >
          Fechar
        </button>
        <button
          type="submit"
          className="flex items-center gap-1 bg-accentdefault text-buttonprimarytext px-3 py-1 rounded"
        >
          <FiPlus /> Adicionar
        </button>
      </div>
    </form>
  ) : (
    <button
      onClick={() => setOpen(true)}
      className="flex items-center gap-1 text-fgmuted text-sm mt-2"
    >
      <FiPlus /> Adicionar tarefa
    </button>
  )
}

export function mapColumnToStatus(col: string) {
  switch (col) {
    case 'backlog': return 1
    case 'todo': return 2
    case 'doing': return 3
    case 'done': return 4
    default: return 1
  }
}

export default AddCard