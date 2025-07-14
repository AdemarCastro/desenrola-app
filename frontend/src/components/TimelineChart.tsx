"use client";

import React, { useState, useMemo, useRef, useCallback } from 'react';
import type { Projeto } from '@/types/projeto';
import type { Tarefa, Responsavel } from '@/types/tarefa';
import { TimelineHeader } from './TimelineHeader';
import { TimelineTaskBar } from './TimelineTaskBar';
import { TaskEditDialog } from './TaskEditDialog';

const parseDateAsLocal = (dateStr?: string | null): Date | null => {
    if (!dateStr) return null;
    const dt = new Date(dateStr);
    if (isNaN(dt.getTime())) return null;
    return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
};

interface TimelineChartProps {
  tarefas: (Tarefa & { cor?: string })[];
  projeto: Projeto;
  usuariosDoProjeto: Responsavel[];
  onUpdateTarefa: (tarefa: Tarefa) => void;
  onRefresh: (projectId: string) => Promise<void>;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ tarefas, projeto, usuariosDoProjeto, onUpdateTarefa, onRefresh }) => {
  const [editingTask, setEditingTask] = useState<Tarefa | null>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  const { startDate, totalDays, todayIndex } = useMemo(() => {
    const validTasks = tarefas.filter(t => t.data_inicio && t.data_fim);
    if (validTasks.length === 0) {
        const fallbackStart = new Date();
        fallbackStart.setDate(fallbackStart.getDate() - 15);
        return { startDate: fallbackStart, totalDays: 60, todayIndex: 15 };
    }

    const dates = validTasks.flatMap(t => [parseDateAsLocal(t.data_inicio), parseDateAsLocal(t.data_fim)]).filter(Boolean) as Date[];
    const timelineStart = new Date(Math.min(...dates.map(d => d.getTime())));
    const timelineEnd = new Date(Math.max(...dates.map(d => d.getTime())));

    timelineStart.setDate(timelineStart.getDate() - 15);
    timelineEnd.setDate(timelineEnd.getDate() + 15);

    const msPerDay = 1000 * 60 * 60 * 24;
    const totalDaysCalc = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / msPerDay);
    
    const hoje = new Date();
    hoje.setUTCHours(0,0,0,0);
    let todayIdx = -1;
    if (hoje >= timelineStart && hoje <= timelineEnd) {
      todayIdx = Math.floor((hoje.getTime() - timelineStart.getTime()) / msPerDay);
    }

    return { startDate: timelineStart, totalDays: totalDaysCalc, todayIndex: todayIdx };
  }, [tarefas]);

  const getDayOffset = useCallback((dateStr?: string | null) => {
    const d = parseDateAsLocal(dateStr);
    if (!d || !startDate) return 0;
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.max(0, Math.floor((d.getTime() - startDate.getTime()) / msPerDay));
  }, [startDate]);
  
  const handleBarUpdate = async (updateData: Partial<Tarefa> & { id: number }) => {
    try {
      const res = await fetch(`/api/tarefas/${updateData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error('Falha ao salvar as datas da tarefa.');
      
      const updatedTask = await res.json();
      onUpdateTarefa(updatedTask);
    } catch (error) {
      console.error(error);
      alert('Não foi possível salvar as alterações. A visualização será restaurada.');
      if (projeto) onRefresh(projeto.id.toString());
    }
  };

  return (
    <div className="flex h-full" ref={timelineContainerRef}>
      <div className="sticky left-0 z-20 bg-white border-r border-zinc-200 w-64 flex-shrink-0">
        <div className="h-[73px] flex items-end p-3 border-b border-zinc-200">
            <h3 className="font-semibold text-zinc-600 text-sm uppercase tracking-wider">Tarefas</h3>
        </div>
        {tarefas.map(tarefa => (
          <div key={tarefa.id} className="h-14 flex items-center px-3 border-b border-zinc-200 truncate">
            <p className="text-sm font-medium truncate">{tarefa.descricao}</p>
          </div>
        ))}
      </div>

      <div className="relative overflow-x-auto">
        <TimelineHeader startDate={startDate} totalDays={totalDays} />
        <div className="relative">
          <div className="absolute top-0 left-0" style={{ width: totalDays * 48 }}>
            {tarefas.map((_, rowIndex) => (
              <div key={rowIndex} className="h-14 border-b border-zinc-200 flex">
                {Array.from({ length: totalDays }).map((__, dayIndex) => (
                  <div key={dayIndex} className="w-12 h-full border-r border-zinc-200/50" />
                ))}
              </div>
            ))}
          </div>
          {todayIndex !== -1 && (
            <div className="absolute top-0 bottom-0 bg-red-500/80 w-0.5 z-10" style={{ left: todayIndex * 48 + 24 }} />
          )}
          {tarefas.map((tarefa, index) => (
            <TimelineTaskBar
              key={tarefa.id}
              tarefa={tarefa}
              index={index}
              startDate={startDate}
              getDayOffset={getDayOffset}
              onUpdate={handleBarUpdate}
              onEditClick={() => setEditingTask(tarefa)}
            />
          ))}
        </div>
      </div>
      
      {editingTask && (
        <TaskEditDialog
          tarefa={editingTask}
          usuariosDoProjeto={usuariosDoProjeto}
          onOpenChange={(isOpen) => !isOpen && setEditingTask(null)}
          onTaskUpdate={(updatedTask) => {
              onUpdateTarefa(updatedTask);
              setEditingTask(null);
          }}
          onTaskDelete={(_taskId) => {
            if (projeto) {
              onRefresh(projeto.id.toString());
            }
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};