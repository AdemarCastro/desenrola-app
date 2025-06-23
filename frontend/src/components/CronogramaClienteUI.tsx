// src/components/CronogramaClienteUI.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Projeto } from '@/types/projeto';
import type { Tarefa } from '@/types/tarefa';
import { ChevronDown, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type TarefaComCor = Tarefa & {
  data_inicio: string;
  data_fim: string;
  cor: string;
};

// Paleta de cores (mesclada das duas versões, com algumas cores extras)
const COLOR_PALETTE = [
  "#60B5FA", "#34D399", "#A78BFA", "#FBBF24",
  "#F472B6", "#38BDF8", "#F87171", "#4ADE80"
];

// Dados de exemplo (mantidos para demonstração)
const DADOS_EXEMPLO: Omit<TarefaComCor, 'cor'>[] = [
  { id: 1, descricao: "Pesquisa de mercado e análise de concorrentes", status_id: 3, prioridade_id: 1, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-07-01", data_fim: "2024-07-10" },
  { id: 2, descricao: "Definição de escopo e requisitos do MVP", status_id: 2, prioridade_id: 1, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-07-11", data_fim: "2024-07-18" },
  { id: 3, descricao: "Design de UI/UX - Wireframes e Protótipos", status_id: 1, prioridade_id: 2, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-07-19", data_fim: "2024-08-05" },
  { id: 4, descricao: "Desenvolvimento do Backend e configuração da API", status_id: 1, prioridade_id: 1, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-08-06", data_fim: "2024-08-25" },
  { id: 5, descricao: "Desenvolvimento do Frontend", status_id: 1, prioridade_id: 1, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-08-20", data_fim: "2024-09-10" },
  { id: 6, descricao: "Testes de integração e QA", status_id: 1, prioridade_id: 3, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-09-11", data_fim: "2024-09-20" },
  { id: 7, descricao: "Configuração de CI/CD e pipelines de automação", status_id: 2, prioridade_id: 2, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-09-21", data_fim: "2024-10-05" },
  { id: 8, descricao: "Deploy em ambiente de staging e validação", status_id: 1, prioridade_id: 2, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-10-06", data_fim: "2024-10-15" },
  { id: 9, descricao: "Correção de bugs encontrados em staging", status_id: 0, prioridade_id: 1, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-10-16", data_fim: "2024-10-25" },
  { id: 10, descricao: "Preparação de ambiente de produção", status_id: 0, prioridade_id: 1, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-10-26", data_fim: "2024-11-05" },
  { id: 11, descricao: "Lançamento em produção e monitoramento inicial", status_id: 0, prioridade_id: 1, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-11-06", data_fim: "2024-11-15" },
  { id: 12, descricao: "Implementação de logging e alertas em produção", status_id: 0, prioridade_id: 2, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-11-16", data_fim: "2024-11-25" },
  { id: 13, descricao: "Coleta de feedback de usuários e métricas de uso", status_id: 0, prioridade_id: 3, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-11-26", data_fim: "2024-12-05" },
  { id: 14, descricao: "Documentação da API e guias de usuário", status_id: 0, prioridade_id: 2, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-12-06", data_fim: "2024-12-15" },
  { id: 15, descricao: "Planejamento de versão 2.0 com novas funcionalidades", status_id: 0, prioridade_id: 1, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2024-12-16", data_fim: "2024-12-31" },
  { id: 16, descricao: "Avaliação de performance e otimizações contínuas", status_id: 0, prioridade_id: 3, criado_em: "2024-07-01", atualizado_em: "", data_inicio: "2025-01-02", data_fim: "2025-01-15" },
];

// Parsing robusto: aceita "YYYY-MM-DD" ou, em fallback, Date(string)
// Retorna Date à meia-noite local, ou null se inválido
const parseDateAsLocal = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  // Primeiro tenta formato "YYYY-MM-DD"
  const parts = dateStr.split("-");
  if (parts.length >= 3) {
    const y = Number(parts[0]);
    const m = Number(parts[1]) - 1;
    // parts[2] pode vir "DD" ou "DDTHH:MM:SS", então pegar os primeiros 2 caracteres
    const dayPart = parts[2].slice(0, 2);
    const d = Number(dayPart);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      const dt = new Date(y, m, d, 0, 0, 0, 0);
      if (!isNaN(dt.getTime())) {
        return dt;
      }
    }
  }
  // Fallback: tentar new Date()
  const dt2 = new Date(dateStr);
  if (!isNaN(dt2.getTime())) {
    dt2.setHours(0, 0, 0, 0);
    return dt2;
  }
  console.warn(`parseDateAsLocal: formato inválido para string de data: "${dateStr}"`);
  return null;
};

// Formata Date para exibição “pt-BR” no tooltip
const formatDateForDisplay = (date: Date | null): string => {
  if (!date) return "";
  // Use Intl.DateTimeFormat com timezone local
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(date);
};

export function CronogramaClientUI({ projetos }: { projetos: Projeto[] }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projetos[0]?.id.toString() || null);
  const [tarefas, setTarefas] = useState<TarefaComCor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedProjectId) {
      setTarefas([]);
      return;
    }
    const fetchTarefas = async () => {
      setLoading(true);
      // Exemplo: mocado. Substitua por fetch real.
      setTimeout(() => {
        const tarefasComCor: TarefaComCor[] = DADOS_EXEMPLO.map((tarefa, idx) => ({
          ...tarefa,
          cor: COLOR_PALETTE[idx % COLOR_PALETTE.length],
        }));
        setTarefas(tarefasComCor);
        setLoading(false);
      }, 300);
    };
    fetchTarefas();
  }, [selectedProjectId]);

  const projetoSelecionado = useMemo(() => {
    return projetos.find(p => p.id.toString() === selectedProjectId) || null;
  }, [projetos, selectedProjectId]);

  return (
    <div className="h-full flex flex-col text-black bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-zinc-200">
        <h1 className="text-2xl font-bold">Cronograma</h1>
        <div className="relative w-64">
          <select
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full appearance-none bg-zinc-100 border border-zinc-300 text-black py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-black cursor-pointer font-medium"
            disabled={loading || projetos.length === 0}
          >
            {projetos.length === 0 && <option>Nenhum projeto</option>}
            <option value="" disabled>Selecione um projeto</option>
            {projetos.map((projeto) => (
              <option key={projeto.id} value={projeto.id.toString()}>
                {projeto.nome}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-600">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-grow overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-500">Carregando cronograma...</p>
          </div>
        ) : !projetoSelecionado ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-500">Selecione um projeto para ver o cronograma.</p>
          </div>
        ) : tarefas.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-500">Este projeto não possui tarefas.</p>
          </div>
        ) : (
          <TimelineChart tarefas={tarefas} projeto={projetoSelecionado} />
        )}
      </div>
    </div>
  );
}

type TimelineChartProps = {
  tarefas: TarefaComCor[];
  projeto: Projeto;
};

const TimelineChart: React.FC<TimelineChartProps> = ({ tarefas, projeto }) => {
  const todayRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // Constantes de layout
  const DAY_WIDTH = 48;    // px por dia
  const ROW_HEIGHT = 52;   // px por linha de tarefa
  const SIDEBAR_WIDTH = 250; // px da coluna de tarefas
  const HEADER_HEIGHT = 73;  // px do cabeçalho (meses+dias)
  const MARGEM_DIAS = 30;    // margem após última tarefa

  // Cálculo de datas, totalDays, meses e todayIndex
  const { startDate, totalDays, months, todayIndex, invalid } = useMemo(() => {
    let invalidFlag = false;

    // Função local para parse
    const pd = parseDateAsLocal;

    // Projeto criado_em parse
    const projDate = pd(projeto.criado_em);
    if (!projDate) {
      console.warn("Projeto.criado_em inválido:", projeto.criado_em);
      invalidFlag = true;
    }
    // Datas de tarefas parse
    const parsedTaskStarts: Date[] = [];
    const parsedTaskEnds: Date[] = [];
    tarefas.forEach(t => {
      const di = pd(t.data_inicio);
      const df = pd(t.data_fim);
      if (!di) {
        console.warn(`Tarefa ${t.id} data_inicio inválida:`, t.data_inicio);
        invalidFlag = true;
      } else parsedTaskStarts.push(di);
      if (!df) {
        console.warn(`Tarefa ${t.id} data_fim inválida:`, t.data_fim);
        invalidFlag = true;
      } else parsedTaskEnds.push(df);
    });

    // Determinar timelineStart:
    // Opção: iniciar no mínimo entre projDate e earliest tarefa. Se preferir apenas projDate, usar projDate direto.
    let timelineStart: Date;
    if (projDate && parsedTaskStarts.length > 0) {
      const earliestTask = new Date(Math.min(...parsedTaskStarts.map(d => d.getTime())));
      const base = new Date(Math.min(projDate.getTime(), earliestTask.getTime()));
      // alinhar ao primeiro dia do mês
      timelineStart = new Date(base.getFullYear(), base.getMonth(), 1, 0, 0, 0, 0);
    } else if (projDate) {
      // sem tarefas parse válidas, só projeto
      timelineStart = new Date(projDate.getFullYear(), projDate.getMonth(), 1, 0, 0, 0, 0);
    } else if (parsedTaskStarts.length > 0) {
      const earliestTask = new Date(Math.min(...parsedTaskStarts.map(d => d.getTime())));
      timelineStart = new Date(earliestTask.getFullYear(), earliestTask.getMonth(), 1, 0, 0, 0, 0);
    } else {
      // tudo inválido: usar hoje como base
      const hoje = new Date();
      hoje.setHours(0,0,0,0);
      timelineStart = new Date(hoje.getFullYear(), hoje.getMonth(), 1, 0,0,0,0);
      invalidFlag = true;
    }

    // Determinar timelineEnd:
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    let timelineEnd = hoje;
    if (parsedTaskEnds.length > 0) {
      const lastTask = new Date(Math.max(...parsedTaskEnds.map(d => d.getTime())));
      if (lastTask > timelineEnd) timelineEnd = lastTask;
    }
    // Adiciona margem de MARGEM_DIAS
    timelineEnd = new Date(timelineEnd.getFullYear(), timelineEnd.getMonth(), timelineEnd.getDate() + MARGEM_DIAS, 0,0,0,0);

    // Calcular totalDays
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffMs = timelineEnd.getTime() - timelineStart.getTime();
    let totalDaysCalc = Math.ceil(diffMs / msPerDay) + 1; // incluir o dia inicial
    if (!Number.isFinite(totalDaysCalc) || totalDaysCalc <= 0) {
      console.warn("totalDays inválido:", totalDaysCalc, { timelineStart, timelineEnd });
      invalidFlag = true;
      totalDaysCalc = 0;
    }

    // Índice de hoje
    let todayIdx = -1;
    if (hoje.getTime() >= timelineStart.getTime() && hoje.getTime() <= timelineEnd.getTime()) {
      todayIdx = Math.floor((hoje.getTime() - timelineStart.getTime()) / msPerDay);
    }

    // Construir meses (apenas dias dentro do intervalo)
    const monthsArr: { name: string; year: number; days: number }[] = [];
    if (totalDaysCalc > 0) {
      const monthIterator = new Date(timelineStart);
      monthIterator.setHours(0,0,0,0);
      while (monthIterator.getTime() <= timelineEnd.getTime()) {
        const year = monthIterator.getFullYear();
        const month = monthIterator.getMonth();
        // Contar dias dentro de [timelineStart, timelineEnd]
        let countDays = 0;
        const temp = new Date(year, month, 1, 0,0,0,0);
        while (temp.getMonth() === month && temp.getTime() <= timelineEnd.getTime()) {
          if (temp.getTime() >= timelineStart.getTime()) {
            countDays++;
          }
          temp.setDate(temp.getDate() + 1);
        }
        if (countDays > 0) {
          monthsArr.push({
            name: monthIterator.toLocaleString('pt-BR', { month: 'long' }),
            year,
            days: countDays,
          });
        }
        // Avança para próximo mês
        monthIterator.setMonth(month + 1, 1);
        monthIterator.setHours(0,0,0,0);
      }
    }

    return {
      startDate: timelineStart,
      totalDays: totalDaysCalc,
      months: monthsArr,
      todayIndex: todayIdx,
      invalid: invalidFlag,
    };
  }, [tarefas, projeto]);

  // Scroll: ao mudar todayIndex ou tarefas, rola para hoje ou para início
  useEffect(() => {
    const container = timelineContainerRef.current;
    if (!container) return;
    if (todayIndex > -1 && todayRef.current) {
    } else {
      // se hoje não estiver visível ou fora do intervalo, rolar para o início
      container.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [todayIndex, tarefas]);

  // Função getDayOffset
  const getDayOffset = useCallback((dateStr: string) => {
    const d = parseDateAsLocal(dateStr);
    if (!d) return 0;
    const msPerDay = 1000 * 60 * 60 * 24;
    const diff = d.getTime() - startDate.getTime();
    const offset = Math.floor(diff / msPerDay);
    return offset < 0 ? 0 : offset;
  }, [startDate]);

  // Guard: se datas inválidas
  if (invalid) {
    return (
      <div className="flex items-center justify-center p-6 text-red-600">
        <p>
          Não foi possível renderizar o cronograma devido a datas inválidas.
          Verifique o formato de <code>criado_em</code> do projeto e
          <code>data_inicio/data_fim</code> das tarefas.
        </p>
      </div>
    );
  }

  // Guard: totalDays zero
  if (totalDays <= 0) {
    return (
      <div className="flex items-center justify-center p-6 text-zinc-500">
        <p>Não há intervalo de datas válido para exibir o cronograma.</p>
      </div>
    );
  }

  // Largura total da timeline em px
  const timelineWidth = totalDays * DAY_WIDTH;
  const timelineHeight = tarefas.length * ROW_HEIGHT;

  return (
    <div
      className="relative"
      style={{ minWidth: SIDEBAR_WIDTH + timelineWidth }}
    >
      <div className="flex">
        {/* Sidebar fixa */}
        <div
          className="sticky left-0 top-0 z-30 bg-white border-r border-zinc-200"
          style={{ width: SIDEBAR_WIDTH }}
        >
          {/* Cabeçalho “Tarefas” */}
          <div
            className="flex items-end p-3 border-b border-zinc-200 bg-white"
            style={{ height: HEADER_HEIGHT }}
          >
            <h3 className="font-semibold text-zinc-600 text-sm uppercase tracking-wider">Tarefas</h3>
          </div>
          {/* Lista de tarefas */}
          <div>
            {tarefas.map((tarefa) => {
                const concluida = tarefa.status_id === 3;
                return (
                    <div
                    key={tarefa.id}
                    className="flex items-center px-3 border-b border-zinc-200 bg-white"
                    style={{ height: ROW_HEIGHT }}
                    title={
                        concluida
                        ? `${tarefa.descricao} (Concluída)`
                        : tarefa.descricao
                    }
                    >
                    {concluida && (
                        <CheckCircle
                        size={16}
                        className="text-green-500 mr-2 flex-shrink-0"
                        />
                    )}
                    <p
                        className={cn(
                        "text-sm font-medium truncate",
                        concluida ? "text-green-600" : "text-zinc-800"
                        )}
                    >
                        {tarefa.descricao}
                    </p>
                    </div>
                );
            })}

          </div>
        </div>

        {/* Área da timeline */}
        <div className="relative overflow-auto" ref={timelineContainerRef}>
          {/* Cabeçalho sticky meses + dias */}
          <div className="sticky top-0 left-0 z-20 bg-white/80 backdrop-blur-sm">
            {/* Meses */}
            <div className="flex">
              {/* Espaço alinhamento com sidebar (pode deixar width 0, pois sidebar é sticky) */}
              <div style={{ width: 0 }} />
              <div className="flex" style={{ width: timelineWidth }}>
                {months.map((m, idx) => (
                  <div
                    key={`${m.name}-${m.year}-${idx}`}
                    className="text-center font-bold text-zinc-700 border-b border-r border-zinc-200 py-2 capitalize"
                    style={{ width: m.days * DAY_WIDTH }}
                  >
                    {m.name} <span className="text-zinc-400 font-normal">{m.year}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Dias */}
            <div className="flex">
              <div style={{ width: 0 }} />
              <div className="flex" style={{ width: timelineWidth }}>
                {Array.from({ length: totalDays }).map((_, i) => {
                  const day = new Date(startDate);
                  day.setDate(day.getDate() + i);
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  const isToday = todayIndex === i;
                  return (
                    <div
                      key={i}
                      className={cn(
                        'h-[32px] flex items-center justify-center text-xs border-r border-b border-zinc-200',
                        isWeekend && 'bg-zinc-100/70'
                      )}
                      style={{ width: DAY_WIDTH }}
                    >
                      <span
                        className={cn(
                          'font-semibold text-zinc-500',
                          isToday && 'bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold'
                        )}
                      >
                        {day.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grid de fundo e barras */}
          <div
            className="relative"
            style={{
              width: timelineWidth,
              height: timelineHeight,
            }}
          >
            {/* Grid de fundo */}
            <div
              className="absolute top-0 left-0"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${totalDays}, ${DAY_WIDTH}px)`,
                gridTemplateRows: `repeat(${tarefas.length}, ${ROW_HEIGHT}px)`,
              }}
            >
              {Array.from({ length: tarefas.length * totalDays }).map((_, idx) => {
                const col = idx % totalDays;
                const row = Math.floor(idx / totalDays);
                const day = new Date(startDate);
                day.setDate(day.getDate() + col);
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                return (
                  <div
                    key={`${row}-${col}`}
                    className={cn(
                      'border-r border-b',
                      isWeekend ? 'bg-zinc-100/70 border-zinc-200/50' : 'border-zinc-200/50'
                    )}
                    style={{ width: DAY_WIDTH, height: ROW_HEIGHT }}
                  />
                );
              })}
            </div>

            {/* Linha de hoje */}
            {todayIndex >= 0 && (
              <div
                ref={todayRef}
                className="absolute top-0 h-full bg-red-500/80 z-25"
                style={{ left: todayIndex * DAY_WIDTH + DAY_WIDTH / 2, width: 2 }}
              />
            )}

            {/* Barras das tarefas */}
            {tarefas.map((tarefa, idx) => {
              const start = getDayOffset(tarefa.data_inicio);
              const end = getDayOffset(tarefa.data_fim);
              const duration = Math.max(1, end - start + 1);
              return (
                <div
                  key={tarefa.id}
                  className="absolute h-9 flex items-center px-3 text-white overflow-hidden rounded-lg shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:brightness-110 cursor-pointer z-10"
                  style={{
                    top: idx * ROW_HEIGHT + (ROW_HEIGHT - 36) / 2,
                    left: start * DAY_WIDTH + 2,
                    width: duration * DAY_WIDTH - 4,
                    backgroundColor: tarefa.cor,
                  }}
                  title={`${tarefa.descricao} (${formatDateForDisplay(parseDateAsLocal(tarefa.data_inicio))} – ${formatDateForDisplay(parseDateAsLocal(tarefa.data_fim))})`}
                >
                  <p className="truncate font-medium text-sm">{tarefa.descricao}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CronogramaClientUI;
