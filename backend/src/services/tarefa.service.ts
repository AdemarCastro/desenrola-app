import { TarefaRepository } from "../repository/tarefa.repository";
import { AnexoRepository } from "../repository/anexo.repository";
import { CreateTarefaInputDto } from "../dtos/tarefa/TarefaInput.dto";
import { UpdateTarefaInputDto } from "../dtos/tarefa/TarefaInput.dto";
import { TarefaOutputDto } from "../dtos/tarefa/TarefaOutput.dto";
import { CreateAnexoInputDto } from "../dtos/anexos/AnexoInput.dto";
import { plainToInstance } from "class-transformer";

export class TarefaService {
  static async findAll(): Promise<TarefaOutputDto[]> {
    const tarefas = await TarefaRepository.findAll();

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

  static async create(data: CreateTarefaInputDto): Promise<TarefaOutputDto> {
    const tarefa = await TarefaRepository.create(data);

    return plainToInstance(TarefaOutputDto, tarefa, {
      excludeExtraneousValues: true,
    });
  }

  static async update(id: number, data: UpdateTarefaInputDto): Promise<TarefaOutputDto> {
    const tarefa = await TarefaRepository.update(id, data);

    return plainToInstance(TarefaOutputDto, tarefa, {
      excludeExtraneousValues: true,
    });
  }

  static async delete(id: number): Promise<void> {
    await TarefaRepository.delete(id);
  }

  static async getComentariosByTarefa(tarefa_id: number) {
    const comentarios = await TarefaRepository.getComentariosByTarefa(tarefa_id);

    return comentarios;
  }

  static async adicionarAnexo(tarefa_id: number, anexo_data: CreateAnexoInputDto): Promise<TarefaOutputDto | null> {
    const tarefaExiste = await TarefaRepository.findById(tarefa_id);
    if (!tarefaExiste) {
      return null;
    }

    await AnexoRepository.create({
      ...anexo_data,
      tarefa: {
        connect: { id: tarefa_id },
      },
    });

    return this.findById(tarefa_id);
  }

  static async removerAnexo(anexo_id: number): Promise<void> {
    await AnexoRepository.delete(anexo_id);
  }
}