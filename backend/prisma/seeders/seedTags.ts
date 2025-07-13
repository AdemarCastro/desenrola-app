import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tagsToSeed: string[] = [
  'Bug',
  'Melhoria',
  'Documentação',
  'Urgente',
  'Backend',
  'Frontend',
  'Refatoração',
];

export async function seedTags() {
  try {
    console.log('🌱 Iniciando seed de Tags...');
    for (const nome of tagsToSeed) {
      await prisma.tag.upsert({
        where: { nome },
        create: { nome },
        update: {},
      });
    }
    console.log('✅ Seed de Tags concluído com sucesso!');
  } catch (error) {
    console.error('🔴 Erro no seed de Tags:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}