import { ComentarioRepository } from "../repository/comentario.repository";
import { ComentarioOutputDto } from "../dtos/comentario/ComentarioOutput.dto";
import { plainToInstance } from "class-transformer";

export class ComentarioService {
  static async findAll(): Promise<ComentarioOutputDto[]> {
    const comentarios = await ComentarioRepository.findAll();

    return plainToInstance(ComentarioOutputDto, comentarios, {
      excludeExtraneousValues: true,
    });
  }

  static async findById(id: number): Promise<ComentarioOutputDto | null> {
    const comentario = await ComentarioRepository.findById(id);

    return plainToInstance(ComentarioOutputDto, comentario, {
      excludeExtraneousValues: true,
    });
  }

  static async create(data: { conteudo: string; id_tarefa: number; id_usuario: number }): Promise<ComentarioOutputDto> {
    const comentario = await ComentarioRepository.create(data);

    return plainToInstance(ComentarioOutputDto, comentario, {
      excludeExtraneousValues: true,
    });
  }

  static async update(id: number, data: { conteudo: string }): Promise<ComentarioOutputDto> {
    const comentario = await ComentarioRepository.update(id, data);

    return plainToInstance(ComentarioOutputDto, comentario, {
      excludeExtraneousValues: true,
    });
  }

  static async delete(id: number): Promise<void> {
    await ComentarioRepository.delete(id);
  }
}