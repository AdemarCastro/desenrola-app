import { PrismaClient } from '@prisma/client';
import { seedComentarios } from './seeders/seedComentarios';
import { seedTarefas } from './seeders/seedTarefas';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding...');

  await seedComentarios();
  await seedTarefas();

  console.log('✅ Seeding concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });