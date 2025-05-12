import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const statusToSeed: string[] = [
  'pendente',
  'em progresso',
  'concluida',
];

export async function seedStatusTarefa() {
  try {
    console.log('🔎 Verificando status de tarefa existentes no banco...');

    for (const nome of statusToSeed) {
      await prisma.statusTarefa.upsert({
        where: { nome },
        create: { nome },
        update: {}, // mantém o existente caso já exista
      });
      console.log(`✅ Status de tarefa upsertado: ${nome}`);
    }

    console.log('🟢 Seed de status de tarefa concluído com sucesso!');
  } catch (error: unknown) {
    console.error('🔴 Erro no seed de status de tarefa:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}