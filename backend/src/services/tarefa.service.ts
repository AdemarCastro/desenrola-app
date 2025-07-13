import { TarefaRepository } from "../repository/tarefa.repository";
import { AnexoRepository } from "../repository/anexo.repository";
import { CreateTarefaInputDto, UpdateTarefaInputDto } from "../dtos/tarefa/TarefaInput.dto";
import { TarefaOutputDto } from "../dtos/tarefa/TarefaOutput.dto";
import { CreateAnexoInputDto } from "../dtos/anexo/AnexoInput.dto";
import { plainToInstance } from "class-transformer";

export class TarefaService {
  static async findAll(): Promise<TarefaOutputDto[]> {
    const tarefas = await TarefaRepository.findAll();
    return plainToInstance(TarefaOutputDto, tarefas, { excludeExtraneousValues: true });
  }

  static async findById(id: number): Promise<TarefaOutputDto | null> {
    const tarefa = await TarefaRepository.findById(id);
    return tarefa ? plainToInstance(TarefaOutputDto, tarefa, { excludeExtraneousValues: true }) : null;
  }

  static async create(data: CreateTarefaInputDto): Promise<TarefaOutputDto> {
    const tarefa = await TarefaRepository.create(data);
    return plainToInstance(TarefaOutputDto, tarefa, { excludeExtraneousValues: true });
  }

  static async update(id: number, data: UpdateTarefaInputDto): Promise<TarefaOutputDto> {
    const tarefa = await TarefaRepository.update(id, data);
    return plainToInstance(TarefaOutputDto, tarefa, { excludeExtraneousValues: true });
  }

  static async delete(id: number): Promise<void> {
    await TarefaRepository.delete(id);
  }

  static async getComentariosByTarefa(tarefa_id: number) {
    return TarefaRepository.getComentariosByTarefa(tarefa_id);
  }

  static async adicionarAnexo(tarefa_id: number, anexo_data: CreateAnexoInputDto): Promise<TarefaOutputDto | null> {
    const tarefaExiste = await TarefaRepository.findById(tarefa_id);
    if (!tarefaExiste) return null;

    await AnexoRepository.create({ ...anexo_data, tarefa: { connect: { id: tarefa_id } } });
    return this.findById(tarefa_id);
  }

  static async removerAnexo(anexo_id: number): Promise<void> {
    await AnexoRepository.delete(anexo_id);
  }

  static async getAnexosByTarefa(tarefaId: number) {
    return TarefaRepository.getAnexosByTarefa(tarefaId);
  }

  static async adicionarResponsaveis(tarefaId: number, usuarioIds: number[]) {
    return TarefaRepository.adicionarResponsaveis(tarefaId, usuarioIds);
  }

  static async removerResponsavel(tarefaId: number, usuarioId: number) {
    return TarefaRepository.removerResponsavel(tarefaId, usuarioId);
  }

  static async getResponsaveisByTarefa(tarefaId: number) {
    return TarefaRepository.getResponsaveisByTarefa(tarefaId);
  }
}