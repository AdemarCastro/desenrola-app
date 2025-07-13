import { PrismaClient } from '@prisma/client';
import { ProjetoRepository } from '../repository/projeto.repository';

const prisma = new PrismaClient();

export class DashboardService {
  static async getDashboardData(projectId: number) {
    const projeto = await ProjetoRepository.findById(projectId);
    if (!projeto) {
      throw new Error('Projeto não encontrado');
    }

    const tarefas = await prisma.tarefa.findMany({
      where: { id_projeto: projectId, apagado_em: null },
    });

    const totalTarefas = tarefas.length;
    const concluidas = tarefas.filter((t) => t.status_id === 3).length;
    const pendentes = tarefas.filter((t) => t.status_id === 1).length;
    const emAndamento = tarefas.filter((t) => t.status_id === 2).length;

    const progressoTarefas = {
      'Pendente': pendentes,
      'Em andamento': emAndamento,
      'Concluída': concluidas,
    };

    const prioridadeTarefas = tarefas.reduce((acc, t) => {
      const prioridade = { 1: 'Baixa', 2: 'Média', 3: 'Alta' }[t.prioridade_id] || 'Outra';
      acc[prioridade] = (acc[prioridade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      projeto,
      stats: { totalTarefas, concluidas, pendentes, emAndamento },
      progressoData: Object.entries(progressoTarefas).map(([name, value]) => ({ name, value })),
      prioridadeData: Object.entries(prioridadeTarefas).map(([name, value]) => ({ name, value })),
    };
  }
}