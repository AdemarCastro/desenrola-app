import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const prioridadesToSeed: string[] = [
  'baixa',
  'media',
  'alta',
];

export async function seedPrioridadeTarefa() {
  try {
    console.log('🔎 Verificando prioridades de tarefa existentes no banco...');

    for (const nome of prioridadesToSeed) {
      await prisma.prioridadeTarefa.upsert({
        where: { nome },
        create: { nome },
        update: {},
      });
      console.log(`✅ Prioridade de tarefa upsertada: ${nome}`);
    }

    console.log('🟢 Seed de prioridades de tarefa concluído com sucesso!');
  } catch (error: unknown) {
    console.error('🔴 Erro no seed de prioridades de tarefa:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}