import { useState, useEffect } from 'react'
import { Tarefa } from '@/types/tarefa'

export function useKanban(projetoId?: number, initialCards: Tarefa[] = [], token?: string) {
  const [cards, setCards] = useState<Tarefa[]>(initialCards)
  const [loading, setLoading] = useState(!initialCards.length)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({})

  // Função para atualizar otimisticamente o status
  const updateCardStatus = (cardId: number, newStatusId: number) => {
    setIsUpdating(prev => ({ ...prev, [cardId]: true }))
    setCards(prev => 
      prev.map(card => 
        card.id === cardId ? { ...card, status_id: newStatusId } : card
      )
    )
  }

  // Função para confirmar atualização no backend
  const confirmStatusUpdate = async (cardId: number, newStatusId: number) => {
    try {
      const res = await fetch(`/api/tarefas/${cardId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status_id: newStatusId }),
      })
      
      if (!res.ok) {
        throw new Error(`Erro ${res.status} ao atualizar tarefa`)
      }
    } catch (error) {
      console.error('Falha na atualização:', error)
      // Reverte a mudança em caso de erro
      setCards(prev => 
        prev.map(card => 
          card.id === cardId 
            ? { ...card, status_id: cards.find(c => c.id === cardId)?.status_id || card.status_id } 
            : card
        )
      )
    } finally {
      setIsUpdating(prev => ({ ...prev, [cardId]: false }))
    }
  }

  useEffect(() => {
    if (initialCards.length || !projetoId) return
    
    const fetchTarefas = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projetos/${projetoId}/tarefas`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            cache: 'no-store'
          }
        )
        
        if (!res.ok) throw new Error(`Erro ${res.status}`)
        const data = await res.json()
        setCards(data.data || data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }
    
    fetchTarefas()
  }, [projetoId, initialCards, token])

  return { 
    cards, 
    setCards, 
    loading, 
    error, 
    updateCardStatus, 
    confirmStatusUpdate,
    isUpdating
  }
}