import { PrismaClient } from '@prisma/client';
import { seedComentarios } from './seeders/seedComentarios';
import { seedTarefas } from './seeders/seedTarefas';
import { seedProjetoUsuarios } from './seeders/seedProjetoUsuarios';
import { seedUsuarios } from './seeders/seedUsuarios';
import { seedProjetos } from './seeders/seedProjetos';
import { seedStatusTarefa } from './seeders/seedStatusTarefa';
import { seedStatusUsuario } from './seeders/seedStatusUsuario';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding...');

  await seedComentarios();
  await seedTarefas();
  await seedProjetoUsuarios();
  await seedUsuarios();
  await seedProjetos();
  await seedStatusTarefa();
  await seedStatusUsuario();

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