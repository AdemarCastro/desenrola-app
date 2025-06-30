"use client";
import React, { DragEvent } from 'react';
import { Trash2 } from 'lucide-react';

interface BurnBarrelProps {
  over: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (taskId: number) => void;
}

export default function BurnBarrel({ over, onDragOver, onDragLeave, onDrop }: BurnBarrelProps) {
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    onDrop(Number(id));
  };

  return (
    <div
      className={`w-16 h-16 flex items-center justify-center rounded-lg ${over ? 'bg-red-800 text-white' : 'bg-gray-200 text-gray-500'}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
    >
      <Trash2 size={24} />
    </div>
  );
}
