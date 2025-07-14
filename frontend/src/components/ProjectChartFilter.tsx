"use client";

import React, { useState, useMemo } from "react";
import type { Projeto } from "@/types/projeto";
import type { Tarefa } from "@/types/tarefa";
import {
  Chart,
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ProjectChartFilterProps {
  projetos: Projeto[];
  tarefas: Tarefa[];
  config: Record<string, { label: string; color: string }>;
}

export function ProjectChartFilter({ projetos, tarefas, config }: ProjectChartFilterProps) {
  const [selectedProject, setSelectedProject] = useState<string>("all");

  const filteredTasks = useMemo(() => {
    if (selectedProject === "all") return tarefas;
    return tarefas.filter((t) => t.id_projeto.toString() === selectedProject);
  }, [tarefas, selectedProject]);

  const dataByMonth = useMemo(() => {
    const map = new Map<string, { created: number; completed: number }>();
    filteredTasks.forEach((task) => {
      const dt = new Date(task.criado_em);
      if (!isNaN(dt.getTime())) {
        const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
        const entry = map.get(key) ?? { created: 0, completed: 0 };
        entry.created++;
        map.set(key, entry);
      }
      if (task.concluido_em) {
        const cd = new Date(task.concluido_em);
        if (!isNaN(cd.getTime())) {
          const keyC = `${cd.getFullYear()}-${String(cd.getMonth() + 1).padStart(2, "0")}`;
          const entryC = map.get(keyC) ?? { created: 0, completed: 0 };
          entryC.completed++;
          map.set(keyC, entryC);
        }
      }
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => new Date(`${a}-01`).getTime() - new Date(`${b}-01`).getTime())
      .map(([key, vals]) => {
        const [year, month] = key.split("-").map(Number);
        const dt = new Date(year, month - 1, 1);
        return {
          month: dt.toLocaleString("pt-BR", { month: "short", year: "2-digit" }),
          created: vals.created,
          completed: vals.completed,
        };
      });
  }, [filteredTasks]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <Select value={selectedProject} onValueChange={(v) => setSelectedProject(v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos Projetos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Projetos</SelectItem>
            {projetos.map((p) => (
              <SelectItem key={p.id} value={p.id.toString()}>
                {p.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ChartContainer config={config} className="w-full h-64">
        <Chart.BarChart data={dataByMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <Chart.XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <Chart.YAxis />
          <Chart.Tooltip content={<ChartTooltipContent />} />
          <Chart.Legend content={<ChartLegendContent />} verticalAlign="top" />
          <Chart.Bar dataKey="created" name="Criadas" fill="hsl(var(--primary))" />
          <Chart.Bar dataKey="completed" name="Concluídas" fill="hsl(var(--secondary-foreground))" />
        </Chart.BarChart>
      </ChartContainer>
    </div>
  );
}
