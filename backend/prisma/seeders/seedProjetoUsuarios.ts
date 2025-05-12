import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProjetoUsuarioSeed {
  usuario_id: number;
  projeto_id: number;
  nivel_acesso_id: number;
}

const projectUsersToSeed: ProjetoUsuarioSeed[] = [
  {
    usuario_id: 1,
    projeto_id: 1,
    nivel_acesso_id: 1,
  },
  {
    usuario_id: 2,
    projeto_id: 1,
    nivel_acesso_id: 2,
  },
  {
    usuario_id: 3,
    projeto_id: 1,
    nivel_acesso_id: 2,
  },
];

export async function seedProjetoUsuarios() {
  try {
    console.log('🔎 Verificando entidades necessárias no banco...');
    const admin = await prisma.usuario.findFirst({ where: { nivel_acesso_id: 1 } });
    const membro = await prisma.usuario.findFirst({ where: { nivel_acesso_id: 2 } });
    const projeto = await prisma.projeto.findFirst();

    if (!admin || !membro || !projeto) {
      throw new Error(
        'Falha ao encontrar usuário admin, membro ou projeto de exemplo. Rode antes as seeds correspondentes.'
      );
    }

    console.log('🔎 Verificando vínculos existentes em ProjetoUsuario...');
    const existing = await prisma.projetoUsuario.findMany({
      where: {
        OR: projectUsersToSeed.map(pu => ({
          usuario_id: pu.usuario_id,
          projeto_id: pu.projeto_id,
        })),
      },
      select: {
        usuario_id: true,
        projeto_id: true,
      },
    });

    const existsSet = new Set(
      existing.map(e => `${e.usuario_id}#${e.projeto_id}`)
    );

    const toInsert = projectUsersToSeed.filter(
      pu => !existsSet.has(`${pu.usuario_id}#${pu.projeto_id}`)
    );

    if (toInsert.length === 0) {
      console.log('⚠️ Todos os vínculos de ProjetoUsuario já existem.');
      return;
    }

    console.log(`📥 Inserindo ${toInsert.length} vínculo(s) em ProjetoUsuario...`);
    for (const pu of toInsert) {
      const already = await prisma.projetoUsuario.findFirst({
        where: {
          usuario_id: pu.usuario_id,
          projeto_id: pu.projeto_id,
        },
      });
      if (already) {
        console.log(`⚠️ Vínculo já existe: usuário ${pu.usuario_id} ⇆ projeto ${pu.projeto_id}`);
        continue;
      }

      await prisma.projetoUsuario.create({
        data: {
          usuario_id: pu.usuario_id,
          projeto_id: pu.projeto_id,
          nivel_acesso_id: pu.nivel_acesso_id,
        },
      });
      console.log(
        `✅ Vínculo criado: usuário ${pu.usuario_id} no projeto ${pu.projeto_id} com nível ${pu.nivel_acesso_id}`
      );
    }

    console.log('🟢 Seed de ProjetoUsuario concluído com sucesso!');
  } catch (error: unknown) {
    console.error('🔴 Erro no seed de ProjetoUsuario:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}