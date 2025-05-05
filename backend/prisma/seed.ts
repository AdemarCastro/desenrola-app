import { seedUsers } from './seeders/seedUsers';
import { seedPapeis } from './seeders/seedPapeis';
import { seedPermissoes } from './seeders/seedPermissoes';

async function main() {
  console.log('🌱 Iniciando seeding...');
  await seedPapeis();
  await seedPermissoes();
  await seedUsers();
  console.log('✅ Seeding concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });