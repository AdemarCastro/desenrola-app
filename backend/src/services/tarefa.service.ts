import { TarefaRepository } from "../repository/tarefa.repository";
import { TarefaOutputDto } from "../dtos/tarefa/TarefaOutput.dto";
import { plainToInstance } from "class-transformer";

export class TarefaService {
  static async findAll(page: number = 1, limit: number = 10): Promise<TarefaOutputDto[]> {
    const skip = (page - 1) * limit;
    const tarefas = await TarefaRepository.findAll(skip, limit);

    return plainToInstance(TarefaOutputDto, tarefas, {
      excludeExtraneousValues: true,
    });
  }

  static async findById(id: number): Promise<TarefaOutputDto | null> {
    const tarefa = await TarefaRepository.findById(id);

    if (!tarefa) {
      return null;
    }

    return plainToInstance(TarefaOutputDto, tarefa, {
      excludeExtraneousValues: true,
    });
  }

  static async create(data: { descricao: string; status_id: number; prioridade_id: number; id_projeto: number }): Promise<TarefaOutputDto> {
    const tarefa = await TarefaRepository.create(data);

    return plainToInstance(TarefaOutputDto, tarefa, {
      excludeExtraneousValues: true,
    });
  }

  static async update(id: number, data: Partial<{ descricao: string; status_id: number; prioridade_id: number }>): Promise<TarefaOutputDto> {
    const tarefa = await TarefaRepository.update(id, data);

    return plainToInstance(TarefaOutputDto, tarefa, {
      excludeExtraneousValues: true,
    });
  }

  static async delete(id: number): Promise<void> {
    await TarefaRepository.delete(id);
  }

  static async getComentariosByTarefa(tarefaId: number) {
    const comentarios = await TarefaRepository.getComentariosByTarefa(tarefaId);

    return comentarios;
  }
}