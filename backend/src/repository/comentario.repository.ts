import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ComentarioRepository {
  static async findAll(skip: number, take: number) {
    return prisma.comentario.findMany({
      where: { apagado_em: null },
      skip,
      take,
      orderBy: { criado_em: "desc" },
    });
  }

  static async findById(id: number) {
    return prisma.comentario.findFirst({
      where: { id, apagado_em: null },
    });
  }

  static async create(data: { conteudo: string; id_tarefa: number; id_usuario: number }) {
    return prisma.comentario.create({
      data,
    });
  }

  static async update(id: number, data: { conteudo: string }) {
    return prisma.comentario.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.comentario.update({
      where: { id },
      data: { apagado_em: new Date() },
    });
  }
}