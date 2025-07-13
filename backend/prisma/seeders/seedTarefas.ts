import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getRandomSample<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

interface TaskSeed {
  descricao: string;
  status_id: number;
  prioridade_id: number;
  data_inicio?: Date;
  data_fim?: Date;
  id_projeto: number;
  concluido_em?: Date;
}

export async function seedTarefas() {
  try {
    console.log('🔎 Verificando se as dependências (projetos, usuários, tags) existem...');
    const projetos = await prisma.projeto.findMany({ select: { id: true } });
    const usuarios: { id: number }[] = await prisma.usuario.findMany({ select: { id: true } });
    const tags: { id: number }[] = await prisma.tag.findMany({ select: { id: true } });

    if (projetos.length === 0 || usuarios.length === 0 || tags.length === 0) {
      throw new Error('Projetos, Usuários ou Tags não encontrados. Execute os seeds correspondentes primeiro.');
    }
    
    console.log('✅ Dependências verificadas.');

    const tasksToSeed: TaskSeed[] = [
      // Desenvolvimento do aplicativo móvel
      { id_projeto: 1, descricao: 'Definir escopo e requisitos do MVP', status_id: 3, prioridade_id: 3, data_inicio: new Date('2025-06-01'), data_fim: new Date('2025-06-10'), concluido_em: new Date('2025-06-09') },
      { id_projeto: 1, descricao: 'Criar wireframes e protótipo de baixa fidelidade', status_id: 3, prioridade_id: 3, data_inicio: new Date('2025-06-11'), data_fim: new Date('2025-06-25'), concluido_em: new Date('2025-06-24') },
      { id_projeto: 1, descricao: 'Design de UI - Telas principais', status_id: 2, prioridade_id: 3, data_inicio: new Date('2025-06-26'), data_fim: new Date('2025-07-15') },
      { id_projeto: 1, descricao: 'Configurar ambiente de desenvolvimento (React Native)', status_id: 2, prioridade_id: 2, data_inicio: new Date('2025-07-16'), data_fim: new Date('2025-07-20') },
      { id_projeto: 1, descricao: 'Desenvolver sistema de autenticação (Login/Cadastro)', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-07-21'), data_fim: new Date('2025-08-05') },
      { id_projeto: 1, descricao: 'Criar componente de Feed de Notícias', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-08-06'), data_fim: new Date('2025-08-20') },
      { id_projeto: 1, descricao: 'Implementar funcionalidade de chat em tempo real', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-08-21'), data_fim: new Date('2025-09-15') },
      { id_projeto: 1, descricao: 'Testes de usabilidade com grupo de foco', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-09-16'), data_fim: new Date('2025-09-22') },
      { id_projeto: 1, descricao: 'Publicar versão beta na TestFlight e Google Play Console', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-09-23'), data_fim: new Date('2025-09-30') },
      { id_projeto: 1, descricao: 'Refatorar componente de Perfil de Usuário', status_id: 1, prioridade_id: 1, data_inicio: new Date('2025-10-01'), data_fim: new Date('2025-10-10') },
      { id_projeto: 1, descricao: 'Implementar notificações Push', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-10-11'), data_fim: new Date('2025-10-25') },
      
      // Desenvolvimento do novo site institucional
      { id_projeto: 2, descricao: 'Análise de concorrentes e pesquisa de mercado', status_id: 3, prioridade_id: 2, data_inicio: new Date('2025-07-01'), data_fim: new Date('2025-07-10'), concluido_em: new Date('2025-07-08') },
      { id_projeto: 2, descricao: 'Definir arquitetura da informação e mapa do site', status_id: 3, prioridade_id: 3, data_inicio: new Date('2025-07-11'), data_fim: new Date('2025-07-18'), concluido_em: new Date('2025-07-17') },
      { id_projeto: 2, descricao: 'Design da Homepage e páginas internas', status_id: 2, prioridade_id: 3, data_inicio: new Date('2025-07-19'), data_fim: new Date('2025-08-05') },
      { id_projeto: 2, descricao: 'Desenvolvimento frontend com Next.js e Tailwind', status_id: 2, prioridade_id: 3, data_inicio: new Date('2025-08-06'), data_fim: new Date('2025-08-30') },
      { id_projeto: 2, descricao: 'Integração com CMS para gerenciamento de conteúdo', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-09-01'), data_fim: new Date('2025-09-15') },
      { id_projeto: 2, descricao: 'Otimização de performance (Core Web Vitals)', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-09-16'), data_fim: new Date('2025-09-25') },
      { id_projeto: 2, descricao: 'Revisão e publicação de todo o conteúdo textual', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-09-26'), data_fim: new Date('2025-09-30') },
      { id_projeto: 2, descricao: 'Configurar formulário de contato com envio de email', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-08-20'), data_fim: new Date('2025-08-25') },
      { id_projeto: 2, descricao: 'Garantir responsividade em todos os dispositivos', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-08-26'), data_fim: new Date('2025-09-05') },
      
      // Migração de infraestrutura para AWS
      { id_projeto: 3, descricao: 'Levantamento da infraestrutura atual', status_id: 3, prioridade_id: 3, data_inicio: new Date('2025-08-01'), data_fim: new Date('2025-08-15'), concluido_em: new Date('2025-08-14') },
      { id_projeto: 3, descricao: 'Planejamento da arquitetura na AWS (VPC, EC2, RDS)', status_id: 2, prioridade_id: 3, data_inicio: new Date('2025-08-16'), data_fim: new Date('2025-09-10') },
      { id_projeto: 3, descricao: 'Configurar scripts de automação (Terraform)', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-09-11'), data_fim: new Date('2025-10-01') },
      { id_projeto: 3, descricao: 'Executar migração do banco de dados principal', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-10-02'), data_fim: new Date('2025-10-10') },
      { id_projeto: 3, descricao: 'Testes de carga e stress no novo ambiente', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-10-11'), data_fim: new Date('2025-10-20') },
      { id_projeto: 3, descricao: 'Configurar monitoramento e alertas (CloudWatch)', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-10-21'), data_fim: new Date('2025-11-05') },
      { id_projeto: 3, descricao: 'Treinamento da equipe de DevOps sobre a nova infra', status_id: 1, prioridade_id: 1, data_inicio: new Date('2025-11-06'), data_fim: new Date('2025-11-12') },
      
      // Implementação do novo fluxo de pagamentos
      { id_projeto: 4, descricao: 'Mapeamento do fluxo atual de pagamentos', status_id: 3, prioridade_id: 3, data_inicio: new Date('2025-09-01'), data_fim: new Date('2025-09-10'), concluido_em: new Date('2025-09-09') },
      { id_projeto: 4, descricao: 'Desenvolver novos microserviços de pagamento', status_id: 2, prioridade_id: 3, data_inicio: new Date('2025-09-11'), data_fim: new Date('2025-10-15') },
      { id_projeto: 4, descricao: 'Criar testes de ponta-a-ponta para o novo fluxo', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-10-16'), data_fim: new Date('2025-10-30') },
      { id_projeto: 4, descricao: 'Integrar com novo provedor de antifraude', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-11-01'), data_fim: new Date('2025-11-10') },
      { id_projeto: 4, descricao: 'Desenvolver dashboard de monitoramento de transações', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-10-20'), data_fim: new Date('2025-11-05') },
      
      // Integração com o SAP para sincronização de pedidos
      { id_projeto: 5, descricao: 'Reunião de kickoff com a equipe do SAP', status_id: 3, prioridade_id: 2, data_inicio: new Date('2025-11-01'), data_fim: new Date('2025-11-02'), concluido_em: new Date('2025-11-02') },
      { id_projeto: 5, descricao: 'Desenvolvimento do conector de autenticação', status_id: 2, prioridade_id: 3, data_inicio: new Date('2025-11-03'), data_fim: new Date('2025-11-20') },
      { id_projeto: 5, descricao: 'Testar endpoint de consulta de pedidos', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-11-21'), data_fim: new Date('2025-11-30') },
      { id_projeto: 5, descricao: 'Documentar a API no Swagger/OpenAPI', status_id: 1, prioridade_id: 1, data_inicio: new Date('2025-12-01'), data_fim: new Date('2025-12-15') },
      
      // Campanha de marketing para o novo produto
      { id_projeto: 6, descricao: 'Definir público-alvo e personas da campanha', status_id: 3, prioridade_id: 3, data_inicio: new Date('2025-06-15'), data_fim: new Date('2025-06-22'), concluido_em: new Date('2025-06-21') },
      { id_projeto: 6, descricao: 'Criar landing page de pré-lançamento', status_id: 2, prioridade_id: 2, data_inicio: new Date('2025-06-23'), data_fim: new Date('2025-07-05') },
      { id_projeto: 6, descricao: 'Produzir conteúdo para redes sociais (posts e vídeos)', status_id: 2, prioridade_id: 1, data_inicio: new Date('2025-07-06'), data_fim: new Date('2025-07-20') },
      { id_projeto: 6, descricao: 'Configurar campanha de Google Ads', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-07-21'), data_fim: new Date('2025-07-25') },
      { id_projeto: 6, descricao: 'Analisar métricas iniciais e otimizar anúncios', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-07-26'), data_fim: new Date('2025-08-01') },
      
      // Rebranding da identidade visual da empresa
      { id_projeto: 7, descricao: 'Workshop de imersão com o cliente', status_id: 3, prioridade_id: 3, data_inicio: new Date('2025-08-10'), data_fim: new Date('2025-08-12'), concluido_em: new Date('2025-08-12') },
      { id_projeto: 7, descricao: 'Desenvolvimento de 3 propostas de logo', status_id: 2, prioridade_id: 3, data_inicio: new Date('2025-08-13'), data_fim: new Date('2025-08-28') },
      { id_projeto: 7, descricao: 'Criação do manual de identidade visual', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-08-29'), data_fim: new Date('2025-09-20') },
      { id_projeto: 7, descricao: 'Aplicar nova identidade no site e redes sociais', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-09-21'), data_fim: new Date('2025-10-05') },
      
      // Campanha de SEO para o novo site
      { id_projeto: 8, descricao: 'Pesquisa de palavras-chave estratégicas', status_id: 2, prioridade_id: 3, data_inicio: new Date('2025-07-15'), data_fim: new Date('2025-07-30') },
      { id_projeto: 8, descricao: 'Otimização on-page de 20 artigos existentes', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-08-01'), data_fim: new Date('2025-08-20') },
      { id_projeto: 8, descricao: 'Construção de 10 backlinks de alta qualidade', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-08-21'), data_fim: new Date('2025-09-10') },
      { id_projeto: 8, descricao: 'Configurar Google Analytics 4 e Search Console', status_id: 3, prioridade_id: 3, data_inicio: new Date('2025-07-10'), data_fim: new Date('2025-07-14'), concluido_em: new Date('2025-07-14') },
      
      // Recrutamento e seleção de trainees
      { id_projeto: 9, descricao: 'Definir perfil e competências dos trainees', status_id: 3, prioridade_id: 3, data_inicio: new Date('2025-09-01'), data_fim: new Date('2025-09-07'), concluido_em: new Date('2025-09-06') },
      { id_projeto: 9, descricao: 'Divulgar vagas nas universidades parceiras', status_id: 2, prioridade_id: 2, data_inicio: new Date('2025-09-08'), data_fim: new Date('2025-09-20') },
      { id_projeto: 9, descricao: 'Realizar dinâmica de grupo com os finalistas', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-10-15'), data_fim: new Date('2025-10-20') },
      { id_projeto: 9, descricao: 'Entrevistas finais com gestores', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-10-21'), data_fim: new Date('2025-11-05') },
      { id_projeto: 9, descricao: 'Enviar cartas de oferta aos aprovados', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-11-10'), data_fim: new Date('2025-11-15') },
      
      // Pesquisa de satisfação dos colaboradores
      { id_projeto: 10, descricao: 'Elaborar questionário da pesquisa', status_id: 3, prioridade_id: 2, data_inicio: new Date('2025-06-20'), data_fim: new Date('2025-06-28'), concluido_em: new Date('2025-06-27')},
      { id_projeto: 10, descricao: 'Disparar e acompanhar a participação na pesquisa', status_id: 3, prioridade_id: 2, data_inicio: new Date('2025-07-01'), data_fim: new Date('2025-07-10'), concluido_em: new Date('2025-07-10') },
      { id_projeto: 10, descricao: 'Analisar resultados e preparar relatório consolidado', status_id: 2, prioridade_id: 3, data_inicio: new Date('2025-07-11'), data_fim: new Date('2025-07-19') },
      { id_projeto: 10, descricao: 'Apresentar resultados para a diretoria', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-07-20'), data_fim: new Date('2025-07-20') },
      
      // Planejamento da festa de fim de ano
      { id_projeto: 11, descricao: 'Contratar buffet e serviço de bar', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-10-01'), data_fim: new Date('2025-10-15') },
      { id_projeto: 11, descricao: 'Definir atração musical (banda/DJ)', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-10-16'), data_fim: new Date('2025-10-30') },
      { id_projeto: 11, descricao: 'Enviar convites e gerenciar RSVPs', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-11-15'), data_fim: new Date('2025-12-05') },
      { id_projeto: 11, descricao: 'Comprar brindes para os colaboradores', status_id: 1, prioridade_id: 1, data_inicio: new Date('2025-11-01'), data_fim: new Date('2025-11-20') },
      
      // Atualização de sistema operacional em todos os computadores
      { id_projeto: 12, descricao: 'Testar compatibilidade de softwares essenciais', status_id: 2, prioridade_id: 3, data_inicio: new Date('2025-07-20'), data_fim: new Date('2025-08-01') },
      { id_projeto: 12, descricao: 'Criar imagem de sistema para deploy em massa', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-08-02'), data_fim: new Date('2025-08-10') },
      { id_projeto: 12, descricao: 'Agendar e executar atualização por departamento', status_id: 1, prioridade_id: 2, data_inicio: new Date('2025-08-11'), data_fim: new Date('2025-08-20') },
      { id_projeto: 12, descricao: 'Oferecer suporte pós-atualização para os usuários', status_id: 1, prioridade_id: 3, data_inicio: new Date('2025-08-21'), data_fim: new Date('2025-08-30') },
    ];

    console.log(`⚙️  Iniciando a inserção de ${tasksToSeed.length} tarefas e suas relações...`);
    
    for (const taskData of tasksToSeed) {
      // Evitar duplicatas
      const existingTask = await prisma.tarefa.findFirst({
        where: { descricao: taskData.descricao, id_projeto: taskData.id_projeto },
      });

      if (existingTask) {
        console.log(`⏭️ Tarefa ignorada (já existe): "${taskData.descricao}"`);
        continue;
      }

      const novaTarefa = await prisma.tarefa.create({ data: taskData });
      console.log(`✅ Tarefa criada: "${novaTarefa.descricao}"`);

      // Atribui de 1 a 3 responsáveis aleatórios
      const responsaveis = getRandomSample(usuarios, Math.floor(Math.random() * 3) + 1);
      for (const usuario of responsaveis) {
          await prisma.tarefaUsuario.create({
              data: {
                  tarefa_id: novaTarefa.id,
                  usuario_id: usuario.id
              }
          }).catch(() => { /* ignora erro de chave duplicada se houver */ });
      }

      // Atribui 1 ou 2 tags aleatórias
      const tagsToConnect = getRandomSample(tags, Math.floor(Math.random() * 2) + 1);
      await prisma.tarefa.update({
        where: { id: novaTarefa.id },
        data: { tags: { connect: tagsToConnect.map(tag => ({ id: tag.id })) } },
      });
      
      // Adiciona um anexo em 50% das tarefas
      if (Math.random() > 0.5) {
        const isLink = Math.random() > 0.5;
        await prisma.anexo.create({
          data: {
            id_tarefa: novaTarefa.id,
            nome_arquivo: isLink ? `Referência Externa` : `documento-anexo-${novaTarefa.id}.pdf`,
            url: isLink ? `https://desenrola.com/ref/${novaTarefa.id}` : `/uploads/documento-anexo-${novaTarefa.id}.pdf`,
            tipo_arquivo: isLink ? 'LINK' : 'DOCUMENTO',
          },
        });
      }
    }

    console.log('🟢 Seed de Tarefas e suas relações concluído com sucesso!');
  } catch (error: unknown) {
    console.error('🔴 Erro no seed de Tarefas:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}