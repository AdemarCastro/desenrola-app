import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const statusUsuariosToSeed: string[] = [
  'ativo',
  'inativo',
  'pendente',
];

export async function seedStatusUsuario() {
  try {
    console.log('🔎 Verificando status de usuário existentes no banco...');

    for (const nome of statusUsuariosToSeed) {
      await prisma.statusUsuario.upsert({
        where: { nome },
        create: { nome },
        update: {},
      });
      console.log(`✅ Status de usuário upsertado: ${nome}`);
    }

    console.log('🟢 Seed de status de usuário concluído com sucesso!');
  } catch (error: unknown) {
    console.error('🔴 Erro no seed de status de usuário:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}