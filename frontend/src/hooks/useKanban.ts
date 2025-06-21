import { useState, useEffect } from 'react'
import { Tarefa } from '@/types/tarefa'

export function useKanban(projetoId?: number, initialCards: Tarefa[] = [], token?: string) {
  const [cards, setCards] = useState<Tarefa[]>(initialCards)
  const [loading, setLoading] = useState(!initialCards.length)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({})

  const updateCardStatus = (cardId: number, newStatusId: number) => {
    setIsUpdating(prev => ({ ...prev, [cardId]: true }))
    setCards(prev => 
      prev.map(card => 
        card.id === cardId ? { ...card, status_id: newStatusId } : card
      )
    )
  }

  const confirmStatusUpdate = async (cardId: number, newStatusId: number) => {
    try {
      // CORREÇÃO: URL correta para atualização de tarefas
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tarefas/${cardId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status_id: newStatusId }),
      })
      
      if (!res.ok) {
        // Melhor tratamento de erro
        let errorMessage = `Erro ${res.status} ao atualizar tarefa`
        
        try {
          const errorData = await res.json()
          if (errorData.error) errorMessage = errorData.error
          else if (errorData.message) errorMessage = errorData.message
        } catch {
          // Não faz nada se não conseguir parsear o JSON
        }
        
        throw new Error(errorMessage)
      }
    } catch (err) {
      console.error('Falha na atualização:', err)
      
      // Tratamento de erro seguro
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      
      // Reverte a mudança em caso de erro
      setCards(prevCards => {
        const originalCard = initialCards.find(c => c.id === cardId) ||
          cards.find(c => c.id === cardId)
        return prevCards.map(card => 
          card.id === cardId 
            ? { ...card, status_id: originalCard?.status_id || card.status_id } 
            : card
        )
      })

      // Atualiza o estado de erro
      setError(errorMessage)
    } finally {
      setIsUpdating(prev => ({ ...prev, [cardId]: false }))
    }
  }

  useEffect(() => {
    if (initialCards.length || !projetoId) return
    
    const fetchTarefas = async () => {
      setLoading(true)
      try {
        // CORREÇÃO: URL correta para buscar tarefas
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projetos/${projetoId}/tarefas`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            cache: 'no-store'
          }
        )
        
        if (!res.ok) {
          let errorMessage = `Erro ${res.status} ao carregar tarefas`
          
          try {
            const errorData = await res.json()
            if (errorData.error) errorMessage = errorData.error
            else if (errorData.message) errorMessage = errorData.message
          } catch {
            // Não faz nada se não conseguir parsear o JSON
          }
          
          throw new Error(errorMessage)
        }
        
        const data = await res.json()
        setCards(data.data || data)
      } catch (err) {
        // Tratamento de erro seguro
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
        setError(errorMessage)
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