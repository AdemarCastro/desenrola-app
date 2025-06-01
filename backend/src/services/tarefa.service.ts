import { PrismaClient } from '@prisma/client';
import { TarefaOutputDto } from '../dtos/tarefa/TarefaOutput.dto';

const prisma = new PrismaClient();

export class TarefaService {
  async findAll(page: number = 1, limit: number = 10): Promise<TarefaOutputDto[]> {
    const skip = (page - 1) * limit;
    return prisma.tarefa.findMany({
      where: { apagado_em: null },
      skip,
      take: limit,
    });
  }

  async findById(id: number): Promise<TarefaOutputDto | null> {
    return prisma.tarefa.findFirst({
      where: { id, apagado_em: null },
    });
  }

  async create(data: {
    descricao: string;
    status_id: number;
    prioridade_id: number;
    id_projeto: number;
  }): Promise<TarefaOutputDto> {
    return prisma.tarefa.create({ data });
  }

  async update(
    id: number,
    data: {
      descricao?: string;
      status_id?: number;
      prioridade_id?: number;
    }
  ): Promise<TarefaOutputDto> {
    return prisma.tarefa.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.tarefa.update({
      where: { id },
      data: { apagado_em: new Date() },
    });
  }

  async getComentariosByTarefa(tarefaId: number) {
    return prisma.comentario.findMany({
      where: { id_tarefa: tarefaId, apagado_em: null },
    });
  }
}