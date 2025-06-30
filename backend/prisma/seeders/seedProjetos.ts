import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProjectSeed {
  nome: string;
  descricao?: string;
  data_entrega?: string;
}

const projectsToSeed: ProjectSeed[] = [
  // Projetos de Tecnologia
  { nome: 'Desenvolvimento App Mobile "ConectaJá"', descricao: 'Criação do aplicativo móvel de rede social para o cliente ConectaJá.', data_entrega: '2025-12-20' },
  { nome: 'Website Institucional "InovaCorp"', descricao: 'Construção do novo portal institucional da InovaCorp com foco em UX e performance.', data_entrega: '2025-09-30' },
  { nome: 'Migração de Servidores para Cloud AWS', descricao: 'Planejamento e execução da migração de toda a infraestrutura on-premise para a AWS.', data_entrega: '2026-03-15' },
  { nome: 'Refatoração do Módulo de Pagamentos', descricao: 'Atualizar a stack e otimizar o fluxo de pagamentos do sistema legado.', data_entrega: '2025-11-10' },
  { nome: 'Implementação de API de Integração com SAP', descricao: 'Desenvolver a camada de serviço para comunicação entre nosso ERP e o SAP do cliente.', data_entrega: '2026-01-25' },

  // Projetos de Marketing
  { nome: 'Campanha de Lançamento - Produto X', descricao: 'Planejamento e execução de todas as ações de marketing para o lançamento do Produto X.', data_entrega: '2025-08-01' },
  { nome: 'Rebranding da Marca "ViverBem"', descricao: 'Projeto completo de rebranding, incluindo nova identidade visual, tom de voz e posicionamento.', data_entrega: '2025-10-05' },
  { nome: 'Otimização de SEO para o Blog', descricao: 'Aumentar o tráfego orgânico do blog em 50% através de técnicas de SEO on-page e off-page.', data_entrega: '2025-09-01' },

  // Projetos de RH
  { nome: 'Programa de Trainee 2026', descricao: 'Estruturação e execução do processo seletivo para o programa de trainees do próximo ano.', data_entrega: '2025-11-30' },
  { nome: 'Pesquisa de Clima Organizacional', descricao: 'Aplicação e análise da pesquisa de clima para identificar pontos de melhoria.', data_entrega: '2025-07-20' },

  // Projetos Internos
  { nome: 'Organização da Festa de Fim de Ano', descricao: 'Planejamento do evento de confraternização da empresa.', data_entrega: '2025-12-10' },
  { nome: 'Atualização do Sistema Operacional dos Desktops', descricao: 'Atualizar todos os computadores da empresa para a nova versão do SO.', data_entrega: '2025-08-20' },
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