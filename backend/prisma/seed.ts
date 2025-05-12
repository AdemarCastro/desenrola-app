import { PrismaClient } from '@prisma/client';
import { seedComentarios } from './seeders/seedComentarios';
import { seedTarefas } from './seeders/seedTarefas';
import { seedProjetoUsuarios } from './seeders/seedProjetoUsuarios';
import { seedUsuarios } from './seeders/seedUsuarios';
import { seedProjetos } from './seeders/seedProjetos';
import { seedStatusTarefa } from './seeders/seedStatusTarefa';
import { seedStatusUsuario } from './seeders/seedStatusUsuario';
import { seedPrioridadeTarefa } from './seeders/seedPrioridadeTarefa';
import { seedNiveisAcesso } from './seeders/seedNiveisAcesso';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding...');

  await seedStatusUsuario();
  await seedNiveisAcesso();
  await seedStatusTarefa();
  await seedPrioridadeTarefa();
  await seedUsuarios();
  await seedProjetos();
  await seedProjetoUsuarios();
  await seedTarefas();
  await seedComentarios();

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