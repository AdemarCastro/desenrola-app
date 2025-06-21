"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import { Projeto } from '@/types/projeto';
import { Tarefa } from '@/types/tarefa';
import KanbanColumn from './KanbanColumn';
import BurnBarrel from './BurnBarrel';

interface KanbanBoardProps {
  projetos: Projeto[];
  tarefas: Tarefa[];
  projetoId?: string;
  token: string;
}

export default function KanbanBoard({ projetos, tarefas: initialTarefas, projetoId, token }: KanbanBoardProps) {
  const router = useRouter();
  const [tarefas, setTarefas] = useState<Tarefa[]>(initialTarefas);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [overTrash, setOverTrash] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    router.push(id ? `/kanban?projetoId=${id}` : '/kanban');
  };

  const updateStatus = async (id: number, newStatus: number) => {
    setError(null);
    const prev = [...tarefas];
    setTarefas(prev.map(t => t.id === id ? { ...t, status_id: newStatus } : t));
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tarefas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
    setError(null);
    const prev = [...tarefas];
    setTarefas(prev.filter(t => t.id !== id));
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tarefas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return router.push('/login');
      if (!res.ok) throw new Error('Erro ao deletar tarefa');
    } catch (err) {
      setTarefas(prev);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
      setOverTrash(false);
    }
  };

  const columns = [
    { id: 2, title: 'To Do' },
    { id: 3, title: 'Doing' },
    { id: 4, title: 'Done' },
  ];

  return (
    <div className="relative flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Kanban</h1>
      {error && <p className="text-red-500 text-sm mb-4">Erro: {error}</p>}

      <div className="flex justify-between mb-4">
        <label className="mr-2 font-medium">Projeto:</label>
        <select value={projetoId || ''} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Todos</option>
          {projetos.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
      </div>

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
          onDragOver={(e) => { e.preventDefault(); setOverTrash(true); }}
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
