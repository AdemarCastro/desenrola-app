"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Chart, ChartContainer, ChartLegendContent, ChartTooltipContent } from '@/components/ui/chart';
import type { Projeto } from '@/types/projeto';
import { Calendar, ChevronDown, User } from 'lucide-react';

// Tipagem para os dados que a API do dashboard retornará
type DashboardData = {
  projeto: Projeto;
  stats: {
    totalTarefas: number;
    concluidas: number;
    pendentes: number;
    emAndamento: number;
  };
  progressoData: { name: string; value: number; fill: string }[];
  prioridadeData: { name: string; value: number }[];
  entregasData: { mes: string; Realizado: number; Meta: number }[];
};

// 1. Configuração de cores para os gráficos
const chartConfig = {
  tarefas: { label: "Tarefas" },
  realizado: { label: "Realizado", color: "hsl(var(--primary))" },
  meta: { label: "Meta", color: "hsl(var(--secondary-foreground))" },
  pendente: { label: "Pendente", color: "#fBBF24" }, // Amarelo
  "em andamento": { label: "Em Andamento", color: "#60A5FA" }, // Azul
  concluida: { label: "Concluída", color: "#34D399" }, // Verde
  alta: { label: "Alta", color: "#F87171" }, // Vermelho
  media: { label: "Média", color: "#FBBF24" }, // Amarelo
  baixa: { label: "Baixa", color: "#60A5FA" }, // Azul
};

export function DashboardClient({
  projetos,
  initialProjectId,
}: {
  projetos: Projeto[];
  initialProjectId: number | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId?.toString() || null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedProjectId) {
      setData(null);
      return;
    }
    
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('projectId', selectedProjectId);
    router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/dashboard/${selectedProjectId}`);
        if (!res.ok) {
          const errorBody = await res.json();
          throw new Error(errorBody.error || 'Falha ao carregar dados do dashboard.');
        }
        const dashboardData: DashboardData = await res.json();
        
        // Adiciona a cor aos dados do gráfico de pizza
        dashboardData.progressoData = dashboardData.progressoData.map(item => ({
            ...item,
            fill: (chartConfig[item.name.toLowerCase() as keyof typeof chartConfig] as { color?: string })?.color || '#ccc'
        }));

        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // A dependência de router e pathname foi removida para evitar re-fetches desnecessários na navegação.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
  };
  
  const formatDate = (dateStr: string | undefined) => {
      if (!dateStr) return 'N/A';
      return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });
  };

  return (
    <div className="h-full flex flex-col text-black bg-white rounded-lg shadow-sm overflow-hidden">
      {/* 2. Header alinhado com o da página de Cronograma */}
      <div className="flex justify-between items-center p-4 border-b border-zinc-200">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* 3. Seletor de projeto com estilo customizado idêntico ao de Cronograma */}
        <div className="relative w-64">
          <select
            value={selectedProjectId || ''}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="w-full appearance-none bg-zinc-100 border border-zinc-300 text-black py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-black cursor-pointer font-medium"
            disabled={loading || projetos.length === 0}
          >
            {projetos.length === 0 ? (
                <option>Nenhum projeto disponível</option>
            ) : (
              <>
                <option value="" disabled>Selecione um projeto</option>
                {projetos.map((p) => (
                  <option key={p.id} value={p.id.toString()}>{p.nome}</option>
                ))}
              </>
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-600">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {/* 4. Conteúdo principal com Grid e tratamento de estados */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {loading ? (
          <DashboardSkeleton />
        ) : error ? (
          <Card className="text-center p-8 border-red-200 bg-red-50">
            <CardTitle className="text-red-600">Erro ao Carregar Dashboard</CardTitle>
            <CardContent className="pt-4 text-red-500">{error}</CardContent>
          </Card>
        ) : data ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Informações do Projeto */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>{data.projeto.nome}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-zinc-600">
                 <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Proprietário: (A definir)</span>
                 </div>
                 <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Entrega: {formatDate(data.projeto.data_entrega)}</span>
                 </div>
              </CardContent>
            </Card>
            
            {/* Gráfico de Progresso */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Progresso das Tarefas</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <Chart.PieChart>
                    <Chart.Tooltip content={<ChartTooltipContent hideLabel />} />
                    <Chart.Pie data={data.progressoData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80}>
                        {data.progressoData.map((entry) => (
                           <Chart.Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                    </Chart.Pie>
                    <Chart.Legend content={<ChartLegendContent />} />
                  </Chart.PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Prioridade */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Prioridade das Tarefas</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <Chart.BarChart data={data.prioridadeData} layout="vertical" margin={{ left: 10 }}>
                    <Chart.Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent hideLabel />} />
                    <Chart.XAxis type="number" hide />
                    <Chart.YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={60} />
                    <Chart.Bar dataKey="value" fill="hsl(var(--primary))" radius={4}>
                       {data.prioridadeData.map((entry) => (
                          <Chart.Cell
                            key={`cell-${entry.name}`}
                            fill={
                              (chartConfig[entry.name.toLowerCase() as keyof typeof chartConfig] as { color?: string })?.color ||
                              "#ccc"
                            }
                          />
                       ))}
                    </Chart.Bar>
                  </Chart.BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Entregas */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Entregas do Projeto (Meta vs. Realizado)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <Chart.LineChart data={data.entregasData}>
                     <Chart.Tooltip content={<ChartTooltipContent />} />
                     <Chart.XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} />
                     <Chart.YAxis />
                     <Chart.CartesianGrid vertical={false} />
                     <Chart.Legend content={<ChartLegendContent />} />
                     <Chart.Line dataKey="Realizado" type="monotone" stroke="var(--color-realizado)" strokeWidth={2} dot={true} />
                     <Chart.Line dataKey="Meta" type="monotone" stroke="var(--color-meta)" strokeWidth={2} strokeDasharray="3 3" dot={false}/>
                  </Chart.LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
           <Card className="text-center p-8 col-span-full bg-gray-50 border-dashed">
              <CardTitle className="text-zinc-700">Bem-vindo ao Dashboard</CardTitle>
              <CardContent className="pt-4">
                <p className="text-zinc-500">Selecione um projeto acima para visualizar suas métricas.</p>
              </CardContent>
           </Card>
        )}
      </div>
    </div>
  );
}

// 5. Skeleton Aprimorado
const DashboardSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    <Card className="lg:col-span-4"><CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader><CardContent><Skeleton className="h-5 w-1/2" /></CardContent></Card>
    <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-[250px] w-full rounded-full" /></CardContent></Card>
    <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><div className="space-y-4"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div></CardContent></Card>
    <Card className="lg:col-span-4"><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent><Skeleton className="h-[300px] w-full" /></CardContent></Card>
  </div>
);