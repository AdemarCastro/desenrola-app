import { TagRepository } from '../repository/tag.repository';
import { Prisma } from '@prisma/client';

export class TagService {
  static async findAll() {
    return TagRepository.findAll();
  }

  static async findById(id: number) {
    return TagRepository.findById(id);
  }

  static async create(data: Prisma.TagCreateInput) {
    return TagRepository.create(data);
  }

  static async update(id: number, data: Prisma.TagUpdateInput) {
    return TagRepository.update(id, data);
  }

  static async delete(id: number) {
    return TagRepository.delete(id);
  }
}