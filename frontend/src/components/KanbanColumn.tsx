"use client";
import React, { DragEvent } from 'react';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  title: string;
  tasks: import('@/types/tarefa').Tarefa[];
  onDrop: (taskId: number) => void;
}

export default function KanbanColumn({ title, tasks, onDrop }: KanbanColumnProps) {
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData('text/plain'));
    if (!isNaN(id)) onDrop(id);
  };

  return (
    <div
      className="flex-1 bg-gray-50 p-4 rounded min-w-[250px] border shadow-sm"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 className="font-bold mb-3 text-gray-700">{title}</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-400 text-sm py-3 text-center">Nenhuma tarefa</p>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
