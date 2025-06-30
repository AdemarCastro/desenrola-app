import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper para gerar um número aleatório de usuários para um projeto
const sampleSize = (arr: number[], size: number) => [...arr].sort(() => 0.5 - Math.random()).slice(0, size);

export async function seedProjetoUsuarios() {
  try {
    console.log('🔎 Buscando todos os usuários e projetos...');
    const usuarios = await prisma.usuario.findMany({ select: { id: true, nivel_acesso_id: true } });
    const projetos = await prisma.projeto.findMany({ select: { id: true } });

    if (usuarios.length === 0 || projetos.length === 0) {
      throw new Error('Usuários ou projetos não encontrados. Execute os seeds correspondentes primeiro.');
    }

    const adminUsers = usuarios.filter(u => u.nivel_acesso_id === 1);
    const managerUsers = usuarios.filter(u => u.nivel_acesso_id === 2);
    const memberUsers = usuarios.filter(u => u.nivel_acesso_id === 3);

    console.log(`📥 Vinculando usuários aos projetos...`);

    for (const projeto of projetos) {
      // 1. Adiciona todos os administradores a todos os projetos
      for (const admin of adminUsers) {
        await prisma.projetoUsuario.upsert({
          where: { usuario_id_projeto_id: { usuario_id: admin.id, projeto_id: projeto.id } },
          update: {},
          create: { usuario_id: admin.id, projeto_id: projeto.id, nivel_acesso_id: 1 },
        });
        console.log(`✅ [Admin] Usuário ${admin.id} vinculado ao projeto ${projeto.id}`);
      }

      // 2. Adiciona um gerente aleatório como proprietário (nível 2)
      if (managerUsers.length > 0) {
          const randomManager = managerUsers[Math.floor(Math.random() * managerUsers.length)];
          await prisma.projetoUsuario.upsert({
              where: { usuario_id_projeto_id: { usuario_id: randomManager.id, projeto_id: projeto.id } },
              update: {},
              create: { usuario_id: randomManager.id, projeto_id: projeto.id, nivel_acesso_id: 2 },
          });
          console.log(`✅ [Proprietário] Usuário ${randomManager.id} vinculado ao projeto ${projeto.id}`);
      }
      
      // 3. Adiciona um número aleatório de membros (entre 3 e 8)
      const randomMembers = sampleSize(memberUsers.map(u => u.id), Math.floor(Math.random() * 6) + 3);
      for (const memberId of randomMembers) {
          await prisma.projetoUsuario.upsert({
              where: { usuario_id_projeto_id: { usuario_id: memberId, projeto_id: projeto.id } },
              update: {},
              create: { usuario_id: memberId, projeto_id: projeto.id, nivel_acesso_id: 3 },
          });
          console.log(`✅ [Membro] Usuário ${memberId} vinculado ao projeto ${projeto.id}`);
      }
    }

    console.log('🟢 Seed de ProjetoUsuario concluído com sucesso!');
  } catch (error: unknown) {
    console.error('🔴 Erro no seed de ProjetoUsuario:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}