import { PrismaClient } from '@prisma/client';
import { ComentarioOutputDto } from '../dtos/comentario/ComentarioOutput.dto';

const prisma = new PrismaClient();

export class ComentarioService {
  async findAll(page: number = 1, limit: number = 10): Promise<ComentarioOutputDto[]> {
    const skip = (page - 1) * limit;
    return prisma.comentario.findMany({
      where: { apagado_em: null },
      skip,
      take: limit,
    });
  }

  async findById(id: number): Promise<ComentarioOutputDto | null> {
    return prisma.comentario.findFirst({
      where: { id, apagado_em: null },
    });
  }

  async create(data: {
    conteudo: string;
    id_tarefa: number;
    id_usuario: number;
  }): Promise<ComentarioOutputDto> {
    return prisma.comentario.create({ data });
  }

  async update(
    id: number,
    data: {
      conteudo: string;
    }
  ): Promise<ComentarioOutputDto> {
    return prisma.comentario.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.comentario.update({
      where: { id },
      data: { apagado_em: new Date() },
    });
  }
}