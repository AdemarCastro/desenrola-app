import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPapeis() {
  const existingPapeis = await prisma.papel.findMany({
    select: { nome: true },
  });

  const existingNomes = new Set(existingPapeis.map((p) => p.nome));

  const papeisToSeed = [
    { nome: 'Admin', descricao: 'Administrador do sistema' },
    { nome: 'User', descricao: 'Usuário padrão' },
  ];

  const newPapeis = papeisToSeed.filter((p) => !existingNomes.has(p.nome));

  if (newPapeis.length > 0) {
    await prisma.papel.createMany({
      data: newPapeis,
    });
    console.log(`${newPapeis.length} papéis criados.`);
  } else {
    console.log('Nenhum novo papel para criar.');
  }
}

export { seedPapeis };