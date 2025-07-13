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
import { seedCargos } from './seeders/seedCargos';
import { seedTags } from './seeders/seedTags';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding...');

  // 1. Tabelas de lookup/enum
  await seedStatusUsuario();
  await seedNiveisAcesso();
  await seedStatusTarefa();
  await seedPrioridadeTarefa();
  
  // 2. Novas tabelas dinâmicas
  await seedCargos();
  await seedTags();

  // 3. Tabelas principais com dependências
  await seedUsuarios();
  await seedProjetos();
  await seedProjetoUsuarios();
  await seedTarefas(); // Este agora cuida de TarefaUsuario, Anexos e Tags
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