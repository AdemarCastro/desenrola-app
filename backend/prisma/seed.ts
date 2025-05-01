import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders/seedUsers';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding...');

  await seedUsers();

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