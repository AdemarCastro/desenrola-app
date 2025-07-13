import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ProjetoRepository {
  static async findAll() {
    return prisma.projeto.findMany({
      where: { apagado_em: null },
      orderBy: { criado_em: "desc" },
    });
  }

  static async findById(id: number) {
    return prisma.projeto.findFirst({
      where: { id, apagado_em: null },
    });
  }

  static async create(data: { nome: string; descricao?: string; data_entrega?: Date }) {
    return prisma.projeto.create({
      data,
    });
  }

  static async update(id: number, data: Partial<{ nome: string; descricao?: string; data_entrega?: Date }>) {
    return prisma.projeto.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.projeto.update({
      where: { id },
      data: { apagado_em: new Date() },
    });
  }

  static async listUsuarios(projetoId: number) {
    return prisma.projetoUsuario.findMany({
      where: { projeto_id: projetoId, apagado_em: null },
      include: {
        usuario: { select: { id: true, primeiro_nome: true, sobrenome: true } },
        nivelAcesso: { select: { id: true, nome: true } },
        projeto: { select: { id: true, nome: true }}
      },
    });
  }

  static async addUsuario(projetoId: number, usuarioId: number, nivelAcessoId: number) {
    return prisma.projetoUsuario.create({
      data: { projeto_id: projetoId, usuario_id: usuarioId, nivel_acesso_id: nivelAcessoId },
    });
  }

  static async updateUsuario(projetoId: number, usuarioId: number, nivelAcessoId: number) {
    return prisma.projetoUsuario.updateMany({
      where: { projeto_id: projetoId, usuario_id: usuarioId },
      data: { nivel_acesso_id: nivelAcessoId },
    });
  }

  static async removeUsuario(projetoId: number, usuarioId: number) {
    return prisma.projetoUsuario.updateMany({
      where: { projeto_id: projetoId, usuario_id: usuarioId, apagado_em: null },
      data: { apagado_em: new Date() },
    });
  }

  static async listTarefas(projetoId: number) {
    return prisma.tarefa.findMany({
      where: { id_projeto: projetoId, apagado_em: null },
    });
  }
}