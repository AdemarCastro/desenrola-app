import { PrismaClient, Projeto } from '@prisma/client';
import { ProjetoOutputDto } from '../dtos/projeto/ProjetoOutput.dto';

const prisma = new PrismaClient();

export class ProjetoService {
  async findAll(page = 1, limit = 10): Promise<ProjetoOutputDto[]> {
    const skip = (page - 1) * limit;
    const projetos = await prisma.projeto.findMany({
      where: { apagado_em: null },
      skip,
      take: limit,
      orderBy: { criado_em: 'desc' },
    });

    return projetos.map((projeto: Projeto) => ({
      ...projeto,
      descricao: projeto.descricao ?? undefined,
    }));
  }

  async findById(id: number): Promise<ProjetoOutputDto | null> {
    return prisma.projeto.findFirst({
      where: { id, apagado_em: null },
    });
  }

  async create(data: {
    nome: string;
    descricao?: string;
    data_entrega?: Date;
  }): Promise<ProjetoOutputDto> {
    return prisma.projeto.create({ data });
  }

  async update(id: number, data: Partial<{ nome: string; descricao?: string; data_entrega?: Date }>): Promise<ProjetoOutputDto> {
    return prisma.projeto.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.projeto.update({
      where: { id },
      data: { apagado_em: new Date() },
    });
  }

  async listUsuarios(id: number) {
    return prisma.projetoUsuario.findMany({
      where: { projeto_id: id, apagado_em: null },
      include: {
        usuario: { select: { id: true, primeiro_nome: true, sobrenome: true } },
        nivel_acesso: { select: { id: true, nome: true } },
      },
    });
  }

  async addUsuario(projetoId: number, usuarioId: number, nivelAcessoId: number) {
    return prisma.projetoUsuario.create({
      data: { projeto_id: projetoId, usuario_id: usuarioId, nivel_acesso_id: nivelAcessoId },
    });
  }

  async updateUsuario(projetoId: number, usuarioId: number, nivelAcessoId: number) {
    return prisma.projetoUsuario.updateMany({
      where: { projeto_id: projetoId, usuario_id: usuarioId },
      data: { nivel_acesso_id: nivelAcessoId },
    });
  }

  async removeUsuario(projetoId: number, usuarioId: number) {
    return prisma.projetoUsuario.updateMany({
      where: { projeto_id: projetoId, usuario_id: usuarioId, apagado_em: null },
      data: { apagado_em: new Date() },
    });
  }

  async listTarefas(projetoId: number) {
    return prisma.tarefa.findMany({
      where: { id_projeto: projetoId, apagado_em: null },
    });
  }
}