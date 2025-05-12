// prisma/seedTarefas.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TaskSeed {
  descricao: string;
  status_id: number;
  prioridade_id: number;
  id_projeto: number;
}

const tasksToSeed: TaskSeed[] = [
  {
    descricao: 'Definir escopo inicial do projeto',
    status_id: 1,
    prioridade_id: 2,
    id_projeto: 1,
  },
  {
    descricao: 'Configurar ambiente de desenvolvimento',
    status_id: 2,
    prioridade_id: 1,
    id_projeto: 1,
  },
  {
    descricao: 'Escrever testes unitários iniciais',
    status_id: 1,
    prioridade_id: 3,
    id_projeto: 1,
  },
];

export async function seedTarefas() {
  try {
    console.log('🔎 Verificando entidades necessárias no banco...');
    const projeto = await prisma.projeto.findFirst();
    const status = await prisma.statusTarefa.findFirst();
    const prioridade = await prisma.prioridadeTarefa.findFirst();

    if (!projeto || !status || !prioridade) {
      throw new Error(
        'Falha ao encontrar Projeto, StatusTarefa ou PrioridadeTarefa de exemplo. Rode antes as seeds de projetos/statuss/prioridades.'
      );
    }

    console.log('🔎 Verificando tarefas existentes no banco...');
    const existing = await prisma.tarefa.findMany({
      where: {
        OR: tasksToSeed.map(t => ({
          descricao: t.descricao,
          id_projeto: projeto.id,
        })),
      },
      select: {
        descricao: true,
        id_projeto: true,
      },
    });

    const existsSet = new Set(
      existing.map((e: { descricao: string; id_projeto: number }) =>
        `${e.descricao}#${e.id_projeto}`
      )
    );

    const toInsert = tasksToSeed.filter(
      t => !existsSet.has(`${t.descricao}#${projeto.id}`)
    );

    if (toInsert.length === 0) {
      console.log('⚠️ Todas as tarefas do seed já existem.');
      return;
    }

    console.log(`📥 Inserindo ${toInsert.length} tarefa(s)...`);
    for (const t of toInsert) {
      const already = await prisma.tarefa.findFirst({
        where: {
          descricao: t.descricao,
          id_projeto: projeto.id,
        },
      });
      if (already) {
        console.log(`⚠️ Tarefa já existe: "${t.descricao}"`);
        continue;
      }

      await prisma.tarefa.create({
        data: {
          descricao: t.descricao,
          status_id: status.id,
          prioridade_id: prioridade.id,
          id_projeto: projeto.id,
        },
      });
      console.log(`✅ Tarefa criada: "${t.descricao}"`);
    }

    console.log('🟢 Seed de tarefas concluído com sucesso!');
  } catch (error: unknown) {
    console.error('🔴 Erro no seed de tarefas:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}