import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TarefaRepository {
  static async findAll() {
    return prisma.tarefa.findMany({
      where: { apagado_em: null },
      orderBy: { criado_em: "desc" },
      include: {
        comentarios: {
          where: { apagado_em: null },
          orderBy: { criado_em: 'asc' }
        },
        anexos: true,
        responsaveis: {
          select: {
            usuario: {
              select: {
                id: true,
                primeiro_nome: true,
                sobrenome: true,
                email: true
              }
            }
          }
        },
        tags: true
      },
    });
  }

  static async findById(id: number) {
    return prisma.tarefa.findFirst({
      where: { id, apagado_em: null },
      orderBy: { criado_em: "desc" },
      include: {
        comentarios: {
          where: { apagado_em: null },
          orderBy: { criado_em: 'asc' }
        },
        anexos: true,
        responsaveis: {
          select: {
            usuario: {
              select: {
                id: true,
                primeiro_nome: true,
                sobrenome: true,
                email: true
              }
            }
          }
        },
        tags: true
      }
    });
  }
  static async create(data: { descricao: string; status_id: number; prioridade_id: number; id_projeto: number }) {
    return prisma.tarefa.create({ data });
  }

  static async update(id: number, data: Prisma.TarefaUpdateInput) {
    return prisma.tarefa.update({ where: { id }, data });
  }

  static async delete(id: number) {
    return prisma.tarefa.update({ where: { id }, data: { apagado_em: new Date() } });
  }

  static async getComentariosByTarefa(tarefaId: number) {
    return prisma.comentario.findMany({ where: { id_tarefa: tarefaId, apagado_em: null } });
  }

  static async getAnexosByTarefa(tarefaId: number) {
    return prisma.anexo.findMany({ where: { id_tarefa: tarefaId } });
  }
  
  static async adicionarResponsaveis(tarefaId: number, usuarioIds: number[]) {
    const operations = usuarioIds.map(usuario_id =>
      prisma.tarefaUsuario.upsert({
        where: { tarefa_id_usuario_id: { tarefa_id: tarefaId, usuario_id: usuario_id } },
        update: {},
        create: { tarefa_id: tarefaId, usuario_id: usuario_id },
      })
    );
    return prisma.$transaction(operations);
  }

  static async removerResponsavel(tarefaId: number, usuarioId: number) {
    return prisma.tarefaUsuario.delete({ where: { tarefa_id_usuario_id: { tarefa_id: tarefaId, usuario_id: usuarioId } } });
  }

  static async getResponsaveisByTarefa(tarefaId: number) {
    return prisma.tarefaUsuario.findMany({
      where: { tarefa_id: tarefaId },
      include: { usuario: { select: { id: true, primeiro_nome: true, email: true } } },
    });
  }
}