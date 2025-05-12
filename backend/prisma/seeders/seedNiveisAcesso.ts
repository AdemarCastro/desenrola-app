import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const niveisToSeed: string[] = [
  'admin',
  'proprietario',
  'membro',
];

export async function seedNiveisAcesso() {
  try {
    console.log('🔎 Verificando níveis de acesso existentes no banco...');

    for (const nome of niveisToSeed) {
      await prisma.nivelAcesso.upsert({
        where: { nome },
        create: { nome },
        update: {},
      });
      console.log(`✅ Nível de acesso upsertado: ${nome}`);
    }

    console.log('🟢 Seed de níveis de acesso concluído com sucesso!');
  } catch (error: unknown) {
    console.error('🔴 Erro no seed de níveis de acesso:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}