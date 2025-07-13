import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnexoRepository {
  static async create(data: Prisma.AnexoCreateInput) {
    return prisma.anexo.create({
      data,
    });
  }

  static async delete(id: number) {
    const anexoExists = await prisma.anexo.findUnique({ where: { id } });
    if (!anexoExists) {
      console.warn(`Tentativa de deletar anexo com ID ${id}, mas ele não foi encontrado.`);
      return null;
    }
    return prisma.anexo.delete({
      where: { id },
    });
  }
}