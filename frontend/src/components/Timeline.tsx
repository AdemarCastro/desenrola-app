import React from 'react';
import type { Projeto } from '@/types/projeto';
import type { Tarefa, Responsavel } from '@/types/tarefa';
import { TimelineChart } from './TimelineChart';
import { TimelineSkeleton } from './TimelineSkeleton';

interface TimelineProps {
  projeto?: Projeto | null;
  tarefas: Tarefa[];
  usuariosDoProjeto: Responsavel[];
  isLoading: boolean;
  error: string | null;
  onUpdateTarefa: (tarefa: Tarefa) => void;
  onRefresh: (projectId: string) => Promise<void>;
}

export const Timeline: React.FC<TimelineProps> = ({ projeto, tarefas, usuariosDoProjeto, isLoading, error, onUpdateTarefa, onRefresh }) => {
  if (isLoading) {
    return <TimelineSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-red-600">
        <p>Erro ao carregar o cronograma: {error}</p>
      </div>
    );
  }

  if (!projeto) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-zinc-500">
        <p>Por favor, selecione um projeto para começar.</p>
      </div>
    );
  }

  if (tarefas.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-zinc-500">
        <p>Este projeto ainda não possui tarefas com datas definidas.</p>
      </div>
    );
  }

  return <TimelineChart tarefas={tarefas} projeto={projeto} usuariosDoProjeto={usuariosDoProjeto} onUpdateTarefa={onUpdateTarefa} onRefresh={onRefresh} />;
};