import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TarefaRepository {
  static async findAll() {
    return prisma.tarefa.findMany({
      where: { apagado_em: null },
      orderBy: { criado_em: "desc" },
    });
  }

  static async findById(id: number) {
    return prisma.tarefa.findFirst({
      where: { id, apagado_em: null },
    });
  }

  static async create(data: { descricao: string; status_id: number; prioridade_id: number; id_projeto: number }) {
    return prisma.tarefa.create({
      data,
    });
  }

  static async update(id: number, data: Partial<{ descricao: string; status_id: number; prioridade_id: number }>) {
    return prisma.tarefa.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.tarefa.update({
      where: { id },
      data: { apagado_em: new Date() },
    });
  }

  static async getComentariosByTarefa(tarefaId: number) {
    return prisma.comentario.findMany({
      where: { id_tarefa: tarefaId, apagado_em: null },
    });
  }
}