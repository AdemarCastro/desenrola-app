"use client";
import React, { DragEvent } from 'react';
import { Tarefa } from '@/types/tarefa';

interface KanbanCardProps {
  task: Tarefa;
  loading?: boolean;
}

export default function KanbanCard({ task, loading = false }: KanbanCardProps) {
  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', String(task.id));
  };

  const prioridadeColor = () => {
    switch (task.prioridade_id) {
      case 1: return 'border-l-gray-500';   // Normal
      case 2: return 'border-l-red-500';    // Alta
      case 3: return 'border-l-green-500';  // Baixa
      default: return 'border-l-gray-500';
    }
  };

  const prioridadeLabel = () => {
    switch (task.prioridade_id) {
      case 1: return 'Normal';
      case 2: return 'Alta';
      case 3: return 'Baixa';
      default: return 'Desconhecida';
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`
        bg-white p-3 rounded shadow relative border-l-4
        ${prioridadeColor()}
        ${loading
          ? 'opacity-70'
          : 'opacity-100 hover:shadow-md transition-shadow'}
      `}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
          Carregando...
        </div>
      )}
      <p className="font-medium mb-1">{task.descricao}</p>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{new Date(task.criado_em).toLocaleDateString('pt-BR')}</span>
        <span>{prioridadeLabel()}</span>
      </div>
    </div>
  );
}
