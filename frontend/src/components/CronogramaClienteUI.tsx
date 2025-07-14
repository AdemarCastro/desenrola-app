"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Projeto } from '@/types/projeto';
import type { Tarefa, Responsavel } from '@/types/tarefa';
import { ChevronDown } from 'lucide-react';
import { Timeline } from '@/components/Timeline';

const COLOR_PALETTE = [
  "#60B5FA", "#34D399", "#A78BFA", "#FBBF24",
  "#F472B6", "#38BDF8", "#F87171", "#4ADE80"
];

export function CronogramaClientUI({ projetos }: { projetos: Projeto[] }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projetos[0]?.id.toString() || null);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [usuariosDoProjeto, setUsuariosDoProjeto] = useState<Responsavel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectData = useCallback(async (projeto_id: string) => {
    setLoading(true);
    setError(null);
    try {
      const [tarefasRes, usuariosRes] = await Promise.all([
        fetch(`/api/projetos/${projeto_id}/tarefas`),
        fetch(`/api/projetos/${projeto_id}/usuarios`)
      ]);

      if (!tarefasRes.ok) throw new Error('Falha ao buscar as tarefas.');
      if (!usuariosRes.ok) throw new Error('Falha ao buscar os usuários do projeto.');
      
      const tarefasData: Tarefa[] = await tarefasRes.json();
      const usuariosResponse: { usuario: Responsavel }[] = await usuariosRes.json();
      const usuariosData = usuariosResponse.map(u => u.usuario);


      const tarefasComCor = tarefasData.map((tarefa, idx) => ({
        ...tarefa,
        cor: COLOR_PALETTE[idx % COLOR_PALETTE.length],
      }));
      
      setTarefas(tarefasComCor);
      setUsuariosDoProjeto(usuariosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setTarefas([]);
      setUsuariosDoProjeto([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectData(selectedProjectId);
    } else {
      setLoading(false);
      setTarefas([]);
      setUsuariosDoProjeto([]);
    }
  }, [selectedProjectId, fetchProjectData]);

  const handleUpdateTarefa = useCallback((tarefaAtualizada: Tarefa) => {
    setTarefas(prevTarefas => 
      prevTarefas.map(t => (t.id === tarefaAtualizada.id ? { ...t, ...tarefaAtualizada } : t))
    );
  }, []);

  const projetoSelecionado = projetos.find(p => p.id.toString() === selectedProjectId);

  return (
    <div className="h-full flex flex-col text-black bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-zinc-200">
        <h1 className="text-2xl font-bold">Cronograma</h1>
        <div className="relative w-64">
          <select
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full appearance-none bg-zinc-100 border border-zinc-300 text-black py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-black cursor-pointer font-medium"
            disabled={loading || projetos.length === 0}
          >
            {projetos.length === 0 ? (
                <option>Nenhum projeto disponível</option>
            ) : (
              <>
                <option value="" disabled>Selecione um projeto</option>
                {projetos.map((p) => (
                  <option key={p.id} value={p.id.toString()}>{p.nome}</option>
                ))}
              </>
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-600">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <Timeline
          tarefas={tarefas}
          projeto={projetoSelecionado}
          usuariosDoProjeto={usuariosDoProjeto}
          isLoading={loading}
          error={error}
          onUpdateTarefa={handleUpdateTarefa}
          onRefresh={() => {
            if (selectedProjectId) {
              return fetchProjectData(selectedProjectId);
            }
            return Promise.resolve();
          }}
        />
      </div>
    </div>
  );
}