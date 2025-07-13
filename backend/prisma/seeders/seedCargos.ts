import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cargosToSeed: string[] = [
  'Desenvolvedor Frontend',
  'Desenvolvedor Backend',
  'UI/UX Designer',
  'Gerente de Projetos',
  'Analista de QA',
  'DevOps',
];

export async function seedCargos() {
  try {
    console.log('🌱 Iniciando seed de Cargos...');
    for (const nome of cargosToSeed) {
      await prisma.cargo.upsert({
        where: { nome },
        create: { nome },
        update: {},
      });
    }
    console.log('✅ Seed de Cargos concluído com sucesso!');
  } catch (error) {
    console.error('🔴 Erro no seed de Cargos:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}