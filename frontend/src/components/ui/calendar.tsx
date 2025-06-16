"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface CalendarProps {
  onSelectDate: (date: Date) => void;
  initialDate?: Date;
  className?: string;
}

export function Calendar({ onSelectDate, initialDate, className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null);

  // Geração de listas para os seletores
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // Últimos 100 anos
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Funções para lidar com as mudanças
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleDateClick = (day: number) => {
    const newSelectedDate = new Date(year, month, day);
    setSelectedDate(newSelectedDate);
    onSelectDate(newSelectedDate);
  };
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentDate(new Date(year, parseInt(e.target.value, 10), 1));
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentDate(new Date(parseInt(e.target.value, 10), month, 1));

  return (
    <div className={cn("p-4 border rounded-lg shadow-sm bg-white w-full max-w-sm", className)}>
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        {/* Seletores de Mês e Ano */}
        <div className="flex gap-2">
            <select
              value={month}
              onChange={handleMonthChange}
              className="p-1 rounded-md border border-zinc-300 bg-white text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-black"
            >
              {months.map((monthName, index) => (
                <option key={monthName} value={index}>
                  {monthName}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={handleYearChange}
              className="p-1 rounded-md border border-zinc-300 bg-white text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-black"
            >
              {years.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
        </div>

        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm text-zinc-500">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-medium">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2">
        {Array.from({ length: startingDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, day) => {
          const dayNumber = day + 1;
          const isSelected = selectedDate?.getUTCDate() === dayNumber && selectedDate?.getUTCMonth() === month && selectedDate?.getUTCFullYear() === year;
          const isToday = new Date().getDate() === dayNumber && new Date().getMonth() === month && new Date().getFullYear() === year;

          return (
            <button
              key={dayNumber}
              onClick={() => handleDateClick(dayNumber)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                { "bg-black text-white": isSelected },
                { "bg-zinc-100": isToday && !isSelected },
                { "hover:bg-zinc-100": !isSelected }
              )}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}
