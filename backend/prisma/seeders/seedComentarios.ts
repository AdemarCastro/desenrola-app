import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CommentSeed {
    conteudo: string;
    id_usuario: number;
    id_tarefa: number;
}

const commentsToSeed: CommentSeed[] = [
    // Comentários na Tarefa 1 (id_tarefa: 1)
    { conteudo: 'Ótimo progresso nesta tarefa! O escopo parece bem definido.', id_usuario: 1, id_tarefa: 1 },
    { conteudo: 'Preciso de mais detalhes sobre os requisitos para a integração com o gateway de pagamento. Alguém do time de produto pode ajudar?', id_usuario: 5, id_tarefa: 1 },
    { conteudo: 'Já marquei uma reunião com o time de produto para alinharmos isso, @Eduarda.', id_usuario: 2, id_tarefa: 1 },
    { conteudo: 'Perfeito, @Bruno. Fico no aguardo.', id_usuario: 5, id_tarefa: 1 },
    
    // Comentários na Tarefa 2 (id_tarefa: 2)
    { conteudo: 'Os wireframes estão prontos para revisão. Feedback é bem-vindo!', id_usuario: 11, id_tarefa: 2 },
    { conteudo: 'Gostei da estrutura, @Larissa. Apenas sugiro ajustar o posicionamento do CTA na tela de login.', id_usuario: 3, id_tarefa: 2 },
    { conteudo: 'Boa observação, @Carla. Farei o ajuste e subirei a nova versão.', id_usuario: 11, id_tarefa: 2 },

    // Comentários na Tarefa 3 (id_tarefa: 3)
    { conteudo: 'Estou iniciando o design da UI hoje. Alguma preferência de paleta de cores?', id_usuario: 12, id_tarefa: 3 },
    { conteudo: 'Vamos seguir o brand book do cliente "ConectaJá". Enviei o arquivo no nosso chat.', id_usuario: 2, id_tarefa: 3 },

    // Comentários na Tarefa 7 (id_tarefa: 7)
    { conteudo: 'Tive um problema com a permissão do IAM para o S3. @Diego, pode me ajudar a verificar?', id_usuario: 8, id_tarefa: 7 },
    { conteudo: 'Claro, @Heitor. Me envie seu usuário por mensagem que eu verifico as políticas de acesso.', id_usuario: 4, id_tarefa: 7 },
];


export async function seedComentarios() {
    try {
        console.log('🔎 Verificando comentários existentes no banco...');

        const existing = await prisma.comentario.findMany({
            where: {
                OR: commentsToSeed.map(c => ({
                    conteudo: c.conteudo,
                    id_tarefa: c.id_tarefa,
                    id_usuario: c.id_usuario,
                })),
            },
            select: {
                conteudo: true,
                id_tarefa: true,
                id_usuario: true,
            },
        });

        const existsSet = new Set(
            existing.map((e: CommentSeed) => `${e.conteudo}#${e.id_usuario}#${e.id_tarefa}`)
        );

        const toInsert = commentsToSeed.filter(
            c => !existsSet.has(`${c.conteudo}#${c.id_usuario}#${c.id_tarefa}`)
        );

        if (toInsert.length === 0) {
            console.log('⚠️ Todos os comentários do seed já existem.');
            return;
        }

        console.log(`📥 Inserindo ${toInsert.length} comentário(s)...`);

        for (const c of toInsert) {
            const existing = await prisma.comentario.findFirst({
                where: {
                    conteudo: c.conteudo,
                    id_tarefa: c.id_tarefa,
                    id_usuario: c.id_usuario,
                },
            });

            if (existing) {
                console.log(`⚠️ Comentário já existe: "${c.conteudo}"`);
                continue;
            }

            await prisma.comentario.create({
                data: {
                    conteudo: c.conteudo,
                    id_usuario: c.id_usuario,
                    id_tarefa: c.id_tarefa,
                },
            });

            console.log(`✅ Comentário "${c.conteudo}" criado e vinculado à tarefa ${c.id_tarefa} e usuário ${c.id_usuario}.`);
        }


        console.log('🟢 Seed de comentários concluído com sucesso!');
    } catch (error: unknown) {
        console.error('🔴 Erro no seed de comentários:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}