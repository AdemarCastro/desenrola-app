import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class TagRepository {
  static async findAll() {
    return prisma.tag.findMany();
  }

  static async findById(id: number) {
    return prisma.tag.findUnique({ where: { id } });
  }

  static async create(data: Prisma.TagCreateInput) {
    return prisma.tag.create({ data });
  }

  static async update(id: number, data: Prisma.TagUpdateInput) {
    return prisma.tag.update({ where: { id }, data });
  }

  static async delete(id: number) {
    return prisma.tag.delete({ where: { id } });
  }
}