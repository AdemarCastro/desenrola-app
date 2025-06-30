"use client";
import React, { useState, useEffect } from 'react';
import { Projeto } from '@/types/projeto';
import { Tarefa } from '@/types/tarefa';
import KanbanBoard from './KanbanBoard';

interface KanbanClientUIProps {
  projetos: Projeto[];
}

export default function KanbanClientUI({ projetos }: KanbanClientUIProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projetos[0]?.id.toString() || null);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedProjectId) {
      setTarefas([]);
      return;
    }
    const fetchTarefas = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/projetos/${selectedProjectId}/tarefas`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Erro ao buscar tarefas');
        const data: Tarefa[] = await res.json();
        setTarefas(data);
      } catch (e) {
        console.error('Erro ao carregar tarefas do projeto:', e);
        setTarefas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTarefas();
  }, [selectedProjectId]);

  return (
    <div className="h-full flex flex-col bg-white text-black rounded-lg shadow-sm overflow-hidden">
      <div className="flex justify-end items-center p-4 border-b border-gray-200">
        <select
          value={selectedProjectId ?? ''}
          onChange={e => setSelectedProjectId(e.target.value || null)}
          className="w-40 bg-gray-100 border border-gray-300 text-black py-2 px-3 rounded-md focus:outline-none"
        >
          <option value="" disabled>Selecione um projeto</option>
          {projetos.map(p => (
            <option key={p.id} value={p.id.toString()}>{p.nome}</option>
          ))}
        </select>
      </div>
      <div className="flex-grow overflow-auto p-4">
        {loading ? (
          <p>Carregando tarefas...</p>
        ) : !selectedProjectId ? (
          <p>Selecione um projeto para exibir tarefas.</p>
        ) : tarefas.length === 0 ? (
          <p>Nenhuma tarefa encontrada para este projeto.</p>
        ) : (
          <KanbanBoard tarefas={tarefas} />
        )}
      </div>
    </div>
  );
}
