import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPermissoes() {
  const existingPermissoes = await prisma.permissao.findMany({
    select: { acao: true },
  });

  const existingAcoes = new Set(existingPermissoes.map((p) => p.acao));

  const permissoesToSeed = [
    { acao: 'CREATE_USER', descricao: 'Criar usuários' },
    { acao: 'DELETE_USER', descricao: 'Deletar usuários' },
  ];

  const newPermissoes = permissoesToSeed.filter((p) => !existingAcoes.has(p.acao));

  if (newPermissoes.length > 0) {
    await prisma.permissao.createMany({
      data: newPermissoes,
    });
    console.log(`${newPermissoes.length} permissões criadas.`);
  } else {
    console.log('Nenhuma nova permissão para criar.');
  }
}

export { seedPermissoes };