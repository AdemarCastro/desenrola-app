import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import type { Tarefa } from '@/types/tarefa';
import type { Projeto } from '@/types/projeto';

const statusMap: { [key: number]: string } = { 1: "Pendente", 2: "Em andamento", 3: "Concluída" };
const prioridadeMap: { [key: number]: string } = { 1: "Alta", 2: "Média", 3: "Baixa" };

// Paleta de cores centralizada no backend
const statusColors: { [key: string]: string } = { "Pendente": "#fBBF24", "Em andamento": "#60A5FA", "Concluída": "#34D399" };
const prioridadeColors: { [key: string]: string } = { "Alta": "#F87171", "Média": "#FBBF24", "Baixa": "#60A5FA" };


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id: projectId } = await params;

  try {
    const [resProjeto, resTarefas] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos/${projectId}/tarefas`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
    ]);

    if (!resProjeto.ok || !resTarefas.ok) {
        const errorBody = await (!resProjeto.ok ? resProjeto.json() : resTarefas.json());
        return NextResponse.json({ error: 'Falha ao buscar dados do projeto ou tarefas', details: errorBody }, { status: 500 });
    }

    const projeto: Projeto = await resProjeto.json();
    const tarefasResponse = await resTarefas.json();
    const tarefas: Tarefa[] = Array.isArray(tarefasResponse) ? tarefasResponse : (tarefasResponse.data || []);

    // Progresso das Tarefas (Gráfico de Pizza)
    const progressoTarefas = tarefas.reduce((acc, tarefa) => {
        const status = statusMap[tarefa.status_id] || "Outro";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Prioridade das Tarefas (Gráfico de Barras)
    const prioridadeTarefas = tarefas.reduce((acc, tarefa) => {
        const prioridade = prioridadeMap[tarefa.prioridade_id] || "Outra";
        acc[prioridade] = (acc[prioridade] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Entregas do Projeto (Gráfico de Linha)
    const entregasPorMes: Record<string, number> = {};
    tarefas.forEach(t => {
      if (t.status_id === 3 && t.concluido_em) {
        const dataConclusao = new Date(t.concluido_em);
        const mesAno = `${dataConclusao.getFullYear()}-${(dataConclusao.getMonth() + 1).toString().padStart(2, '0')}`;
        entregasPorMes[mesAno] = (entregasPorMes[mesAno] || 0) + 1;
      }
    });

    const dataInicioProjeto = new Date(projeto.criado_em);
    const dataFimProjeto = projeto.data_entrega ? new Date(projeto.data_entrega) : new Date();
    if (!projeto.data_entrega) dataFimProjeto.setMonth(dataFimProjeto.getMonth() + 1);

    const meses: string[] = [];
    const dataCorrente = new Date(dataInicioProjeto.getFullYear(), dataInicioProjeto.getMonth(), 1);
    while (dataCorrente <= dataFimProjeto) {
        meses.push(`${dataCorrente.getFullYear()}-${(dataCorrente.getMonth() + 1).toString().padStart(2, '0')}`);
        dataCorrente.setMonth(dataCorrente.getMonth() + 1);
    }
    
    let realizadoAcumulado = 0;
    const totalTarefas = tarefas.length;
    const totalMeses = meses.length > 0 ? meses.length : 1;

    const entregasProjeto = meses.map((mes, index) => {
      realizadoAcumulado += (entregasPorMes[mes] || 0);
      return {
        mes: new Date(mes + '-02').toLocaleString('pt-BR', { month: 'short', year: '2-digit' }),
        Realizado: realizadoAcumulado,
        Meta: Math.round((totalTarefas / totalMeses) * (index + 1))
      };
    });
    
    // Formatação final dos dados
    const dashboardData = {
      projeto,
      stats: {
        totalTarefas: tarefas.length,
        concluidas: progressoTarefas['Concluída'] || 0,
        pendentes: progressoTarefas['Pendente'] || 0,
        emAndamento: progressoTarefas['Em andamento'] || 0,
      },
      progressoData: Object.entries(progressoTarefas).map(([name, value]) => ({ name, value, fill: statusColors[name] || '#cccccc' })),
      prioridadeData: Object.entries(prioridadeTarefas).map(([name, value]) => ({ name, value, fill: prioridadeColors[name] || '#cccccc' })),
      entregasData: entregasProjeto,
    };

    return NextResponse.json(dashboardData);

  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro inesperado no servidor.';
    console.error(`ERRO NA API /api/dashboard/${projectId}:`, e);
    return NextResponse.json({ error: 'Erro interno do servidor.', details: message }, { status: 500 });
  }
}