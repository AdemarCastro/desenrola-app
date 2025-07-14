import { TarefaRepository } from "../repository/tarefa.repository";
import { AnexoRepository } from "../repository/anexo.repository";
import { CreateTarefaInputDto, UpdateTarefaInputDto } from "../dtos/tarefa/TarefaInput.dto";
import { TarefaOutputDto } from "../dtos/tarefa/TarefaOutput.dto";
import { CreateAnexoInputDto } from "../dtos/anexo/AnexoInput.dto";
import { plainToInstance } from "class-transformer";
import { Tarefa } from "@prisma/client";

type ResponsavelPayload = {
  usuario: {
    id: number;
    primeiro_nome: string;
    sobrenome: string;
    email: string;
  };
};

type TarefaFromRepo = Omit<Tarefa, 'responsaveis'> & {
  responsaveis: ResponsavelPayload[];
};

function formatarTarefa(tarefa: TarefaFromRepo | null): TarefaOutputDto | null {
    if (!tarefa) return null;

    const responsaveisFormatados = (tarefa.responsaveis || []).map(
      (relacao) => relacao.usuario
    );

    const tarefaCompleta = {
        ...tarefa,
        responsaveis: responsaveisFormatados,
    };
    
    return plainToInstance(TarefaOutputDto, tarefaCompleta, { excludeExtraneousValues: true });
}


export class TarefaService {
  
  static async findAll(): Promise<TarefaOutputDto[]> {
    const tarefas = await TarefaRepository.findAll();
    return tarefas.map(tarefa => formatarTarefa(tarefa as unknown as TarefaFromRepo)).filter(t => t !== null) as TarefaOutputDto[];
  }

  static async findById(id: number): Promise<TarefaOutputDto | null> {
    const tarefa = await TarefaRepository.findById(id);
    return formatarTarefa(tarefa as unknown as TarefaFromRepo);
  }

  static async create(data: CreateTarefaInputDto): Promise<TarefaOutputDto> {
    const tarefa = await TarefaRepository.create(data);
    const tarefaCompleta = await TarefaRepository.findById(tarefa.id);
    return formatarTarefa(tarefaCompleta as unknown as TarefaFromRepo) as TarefaOutputDto;
  }

  static async update(id: number, data: UpdateTarefaInputDto): Promise<TarefaOutputDto> {
    const tarefa = await TarefaRepository.update(id, data);
    const tarefaCompleta = await TarefaRepository.findById(tarefa.id);
    return formatarTarefa(tarefaCompleta as unknown as TarefaFromRepo) as TarefaOutputDto;
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