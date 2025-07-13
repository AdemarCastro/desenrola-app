import { CargoRepository } from '../repository/cargo.repository';
import { Prisma } from '@prisma/client';

export class CargoService {
  static async findAll() {
    return CargoRepository.findAll();
  }

  static async findById(id: number) {
    return CargoRepository.findById(id);
  }

  static async create(data: Prisma.CargoCreateInput) {
    return CargoRepository.create(data);
  }

  static async update(id: number, data: Prisma.CargoUpdateInput) {
    return CargoRepository.update(id, data);
  }

  static async delete(id: number) {
    return CargoRepository.delete(id);
  }
}