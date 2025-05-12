import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProjectSeed {
  nome: string;
  descricao?: string;
  data_entrega?: string;
}

const projectsToSeed: ProjectSeed[] = [
  { nome: 'Desenvolvimento App Mobile', descricao: 'Projeto para criar o aplicativo móvel do cliente X.', data_entrega: '2025-08-31' },
  { nome: 'Website Institucional',            descricao: 'Construção do site institucional da empresa Y.',   data_entrega: '2025-07-15' },
];

export async function seedProjetos() {
  try {
    console.log('🔎 Verificando projetos existentes no banco...');
    for (const proj of projectsToSeed) {
      const existing = await prisma.projeto.findFirst({
        where: { nome: proj.nome },
      });
      if (existing) {
        console.log(`⚠️ Projeto já existe: "${proj.nome}"`);
        continue;
      }
      await prisma.projeto.create({
        data: {
          nome: proj.nome,
          descricao: proj.descricao,
          data_entrega: proj.data_entrega ? new Date(proj.data_entrega) : undefined,
        },
      });
      console.log(`✅ Projeto criado: "${proj.nome}"`);
    }
    console.log('🟢 Seed de projetos concluído com sucesso!');
  } catch (error: unknown) {
    console.error('🔴 Erro no seed de projetos:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}