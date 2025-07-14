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
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null);
  const [month, setMonth] = useState(initialDate ? initialDate.getMonth() : new Date().getMonth());
  const [year, setYear] = useState(initialDate ? initialDate.getFullYear() : new Date().getFullYear());

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDay = new Date(year, month, 1).getDay();

  const years = Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - 10 + i);

  const handleDateClick = (day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
    onSelectDate(newDate);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value));
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

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
          const isSelected = selectedDate?.getDate() === dayNumber && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;
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
