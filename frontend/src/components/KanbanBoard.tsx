"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import { Tarefa } from '@/types/tarefa';
import KanbanColumn from './KanbanColumn';
import BurnBarrel from './BurnBarrel';

interface KanbanBoardProps {
  tarefas: Tarefa[];
}

export default function KanbanBoard({ tarefas: initialTarefas }: KanbanBoardProps) {
  const router = useRouter();
  // Inicializa todas as tarefas em To Do (status_id = 1)
  const [tarefas, setTarefas] = useState<Tarefa[]>(
    initialTarefas.map(t => ({ ...t, status_id: 1 }))
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [overTrash, setOverTrash] = useState(false);

  const updateStatus = async (id: number, newStatus: number) => {
    setError(null);
    const prev = [...tarefas];
    setTarefas(prev.map(t => 
      t.id === id ? { ...t, status_id: newStatus } : t
    ));
    
    setLoading(true);
    try {
      const res = await fetch(`/api/tarefas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status_id: newStatus }),
      });
      
      if (res.status === 401) return router.push('/login');
      if (!res.ok) throw new Error('Erro ao atualizar tarefa');
    } catch (err) {
      setTarefas(prev);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    const prev = [...tarefas];
    setTarefas(tarefas.filter(t => t.id !== id));

    try {
      const res = await fetch(`/api/tarefas/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Erro ao deletar tarefa");

      // Recarrega a página para obter o estado mais recente
      router.refresh();
    } catch (error) {
      setTarefas(prev);
      console.error(error);
    }
  };

  const columns = [
    { id: 1, title: 'To Do' },
    { id: 2, title: 'Doing' },
    { id: 3, title: 'Done' },
  ];

  return (
    <div className="relative flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Kanban</h1>
      
      {error && (
        <p className="text-red-500 text-sm mb-4">Erro: {error}</p>
      )}
      
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(col => (
          <KanbanColumn
            key={col.id}
            title={col.title}
            tasks={tarefas.filter(t => t.status_id === col.id)}
            onDrop={(taskId) => updateStatus(taskId, col.id)}
          />
        ))}
        
        <BurnBarrel
          over={overTrash}
          onDragOver={(e) => { 
            e.preventDefault(); 
            setOverTrash(true); 
          }}
          onDragLeave={() => setOverTrash(false)}
          onDrop={(taskId) => deleteTask(taskId)}
        />
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <FaSpinner className="animate-spin text-4xl text-gray-600" />
        </div>
      )}
    </div>
  );
}