"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { Tarefa } from '@/types/tarefa';
import { DraggableCore, type DraggableData, type DraggableEvent } from 'react-draggable';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const DAY_WIDTH = 48;

const parseDateAsLocal = (dateStr?: string | null): Date | null => {
    if (!dateStr) return null;
    const dt = new Date(dateStr);
    if (isNaN(dt.getTime())) return null;
    return new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate());
};

const formatDateForDisplay = (dateStr?: string | null): string => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

export const TimelineTaskBar: React.FC<{
  tarefa: Tarefa & { cor?: string };
  index: number;
  startDate: Date;
  getDayOffset: (date?: string | null) => number;
  onUpdate: (tarefa: Partial<Tarefa> & { id: number }) => void;
  onEditClick: () => void;
}> = ({ tarefa, index, startDate, getDayOffset, onUpdate, onEditClick }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const [position, setPosition] = useState({ x: 0 });
  const [size, setSize] = useState({ width: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const startOffset = getDayOffset(tarefa.data_inicio);
    const endOffset = getDayOffset(tarefa.data_fim);
    const duration = Math.max(1, endOffset - startOffset + 1);

    setPosition({ x: startOffset * DAY_WIDTH });
    setSize({ width: duration * DAY_WIDTH });
  }, [tarefa, getDayOffset]);

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    setPosition(prev => ({ x: prev.x + data.deltaX }));
  };

  const handleResizeStart = (_e: DraggableEvent, data: DraggableData) => {
    setSize(prev => ({ width: Math.max(DAY_WIDTH, prev.width - data.deltaX) }));
    setPosition(prev => ({ x: prev.x + data.deltaX }));
  };

  const handleResizeEnd = (_e: DraggableEvent, data: DraggableData) => {
    setSize(prev => ({ width: Math.max(DAY_WIDTH, prev.width + data.deltaX) }));
  };

  const onStop = () => {
    setIsDragging(false);
    const startDayIndex = Math.round(position.x / DAY_WIDTH);
    const durationInDays = Math.max(1, Math.round(size.width / DAY_WIDTH));
    
    const newStartDate = new Date(startDate.getTime());
    newStartDate.setUTCDate(startDate.getUTCDate() + startDayIndex);

    const newEndDate = new Date(newStartDate.getTime());
    newEndDate.setUTCDate(newStartDate.getUTCDate() + durationInDays - 1);
    
    const originalStartDate = parseDateAsLocal(tarefa.data_inicio);
    const originalEndDate = parseDateAsLocal(tarefa.data_fim);

    // Verifica se houve mudança para evitar requisições desnecessárias
    if (originalStartDate?.getTime() !== newStartDate.getTime() || originalEndDate?.getTime() !== newEndDate.getTime()) {
      onUpdate({
        id: tarefa.id,
        data_inicio: newStartDate.toISOString(),
        data_fim: newEndDate.toISOString(),
      });
    }
  };

  const topPosition = index * 56 + 8;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={nodeRef}
            className={cn(
              "absolute h-10 z-10 group",
              isDragging && "shadow-xl scale-105"
            )}
            style={{
              transform: `translateX(${position.x}px)`,
              width: `${size.width}px`,
              top: `${topPosition}px`,
              transition: isDragging ? 'none' : 'transform 200ms ease, width 200ms ease',
            }}
          >
            {/* Handle para redimensionar o início */}
            <DraggableCore nodeRef={nodeRef} onDrag={handleResizeStart} onStart={() => setIsDragging(true)} onStop={onStop}>
              <div className="absolute left-0 top-0 h-full w-2 cursor-ew-resize z-20" />
            </DraggableCore>

            {/* Corpo da tarefa para mover */}
            <DraggableCore nodeRef={nodeRef} onDrag={handleDrag} onStart={() => setIsDragging(true)} onStop={onStop}>
              <div
                className="relative h-full flex items-center px-3 text-white overflow-hidden rounded-md shadow-sm transition-all duration-200 ease-in-out group-hover:shadow-lg group-hover:brightness-110 cursor-move"
                style={{ backgroundColor: tarefa.cor || '#3b82f6' }}
                onClick={onEditClick}
              >
                <p className="truncate font-medium text-sm pointer-events-none mx-2">{tarefa.descricao}</p>
              </div>
            </DraggableCore>

            {/* Handle para redimensionar o fim */}
            <DraggableCore nodeRef={nodeRef} onDrag={handleResizeEnd} onStart={() => setIsDragging(true)} onStop={onStop}>
              <div className="absolute right-0 top-0 h-full w-2 cursor-ew-resize z-20" />
            </DraggableCore>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white rounded-md p-2 shadow-lg">
          <p className="font-bold">{tarefa.descricao}</p>
          <p>Início: {formatDateForDisplay(tarefa.data_inicio)}</p>
          <p>Fim: {formatDateForDisplay(tarefa.data_fim)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};