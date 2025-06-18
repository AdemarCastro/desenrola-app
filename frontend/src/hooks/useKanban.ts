import { useState, useEffect } from 'react'
import { Tarefa } from '@/types/tarefa'

export function useKanban(projetoId?: number) {
  const [cards, setCards] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // se não há projeto selecionado, exibe quadro vazio
    if (!projetoId) {
      setCards([])
      setLoading(false)
      setError(null)
      return
    }

    async function fetchTarefas() {
      setLoading(true)
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projetos/${projetoId}/tarefas`,
          { cache: 'no-store' }
        )
        if (!res.ok) throw new Error('Erro ao carregar tarefas')
        const body = await res.json()
        setCards(body.data ?? body)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTarefas()
  }, [projetoId])

  return { cards, setCards, loading, error }
}