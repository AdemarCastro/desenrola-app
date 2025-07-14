"use client";

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface MonthInfo {
  name: string;
  year: number;
  days: number;
}

interface TimelineHeaderProps {
  startDate: Date;
  totalDays: number;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = React.memo(({ startDate, totalDays }) => {
  const months = useMemo(() => {
    const monthMap: { [key: string]: MonthInfo } = {};
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate.getTime());
      date.setUTCDate(startDate.getUTCDate() + i);

      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();

      const monthKey = `${year}-${month}`;
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          name: date.toLocaleString('pt-BR', { month: 'long', timeZone: 'UTC' }),
          year: year,
          days: 0,
        };
      }
      monthMap[monthKey].days++;
    }
    return Object.values(monthMap);
  }, [startDate, totalDays]);

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
      <div className="flex">
        {months.map((m: MonthInfo, idx: number) => (
          <div key={`${m.name}-${idx}`} className="text-center font-bold text-zinc-700 border-b border-r border-zinc-200 py-2 capitalize flex-shrink-0" style={{ width: m.days * 48 }}>
            {m.name} <span className="text-zinc-400 font-normal">{m.year}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = new Date(startDate.getTime());
          day.setUTCDate(startDate.getUTCDate() + i);
          
          const isWeekend = day.getUTCDay() === 0 || day.getUTCDay() === 6;
          return (
            <div 
              key={i} 
              className={cn(
                'h-8 w-12 flex items-center justify-center text-xs border-r border-b border-zinc-200 flex-shrink-0',
                isWeekend && 'bg-zinc-100/70'
              )}
            >
              <span className="font-semibold text-zinc-500">{day.getUTCDate()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

TimelineHeader.displayName = 'TimelineHeader';