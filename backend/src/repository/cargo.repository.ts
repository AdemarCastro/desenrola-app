import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class CargoRepository {
  static async findAll() {
    return prisma.cargo.findMany();
  }

  static async findById(id: number) {
    return prisma.cargo.findUnique({ where: { id } });
  }

  static async create(data: Prisma.CargoCreateInput) {
    return prisma.cargo.create({ data });
  }

  static async update(id: number, data: Prisma.CargoUpdateInput) {
    return prisma.cargo.update({ where: { id }, data });
  }

  static async delete(id: number) {
    return prisma.cargo.delete({ where: { id } });
  }
}