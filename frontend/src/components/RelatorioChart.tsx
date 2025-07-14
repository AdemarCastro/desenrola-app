"use client";

import React from "react";
import {
  Chart,
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface RelatoriosChartProps {
  data: Array<{ month: string; created: number; completed: number }>;
  config: Record<string, { label: string; color: string }>;
}

export function RelatoriosChart({ data, config }: RelatoriosChartProps) {
  return (
    <ChartContainer config={config} className="w-full h-64">
      <Chart.BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <Chart.XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <Chart.YAxis />
        <Chart.Tooltip content={<ChartTooltipContent />} />
        <Chart.Legend content={<ChartLegendContent />} verticalAlign="top" />
        <Chart.Bar dataKey="created" name="Criadas" fill="hsl(var(--primary))" />
        <Chart.Bar dataKey="completed" name="Concluídas" fill="hsl(var(--secondary-foreground))" />
      </Chart.BarChart>
    </ChartContainer>
  );
}