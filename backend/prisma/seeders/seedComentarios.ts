import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CommentSeed {
    conteudo: string;
    id_usuario: number;
    id_tarefa: number;
}

const commentsToSeed: CommentSeed[] = [
    {
        conteudo: 'Ótimo progresso nesta tarefa!',
        id_usuario: 1,
        id_tarefa: 1,
    },
    {
        conteudo: 'Preciso de mais detalhes sobre os requisitos.',
        id_usuario: 2,
        id_tarefa: 1,
    },
    {
        conteudo: 'Tarefa concluída? Por favor, marque como concluída quando terminar.',
        id_usuario: 1,
        id_tarefa: 1,
    },
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
            existing.map(e => `${e.conteudo}#${e.id_usuario}#${e.id_tarefa}`)
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

            console.log(`✅ Comentário criado: "${c.conteudo}"`);
        }


        console.log('🟢 Seed de comentários concluído com sucesso!');
    } catch (error) {
        console.error('🔴 Erro no seed de comentários:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}