import { ProjetoRepository } from "../repository/projeto.repository";
import { ProjetoOutputDto } from "../dtos/projeto/ProjetoOutput.dto";

export class ProjetoService {
  static async findAll(page = 1, limit = 10): Promise<ProjetoOutputDto[]> {
    const skip = (page - 1) * limit;
    const projetos = await ProjetoRepository.findAll(skip, limit);

    return projetos.map((projeto) => ({
      ...projeto,
      descricao: projeto.descricao ?? undefined,
    }));
  }

  static async findById(id: number): Promise<ProjetoOutputDto | null> {
    return ProjetoRepository.findById(id);
  }

  static async create(data: { nome: string; descricao?: string; data_entrega?: Date }): Promise<ProjetoOutputDto> {
    return ProjetoRepository.create(data);
  }

  static async update(id: number, data: Partial<{ nome: string; descricao?: string; data_entrega?: Date }>): Promise<ProjetoOutputDto> {
    return ProjetoRepository.update(id, data);
  }

  static async delete(id: number): Promise<void> {
    await ProjetoRepository.delete(id);
  }

  static async listUsuarios(projetoId: number) {
    return ProjetoRepository.listUsuarios(projetoId);
  }

  static async addUsuario(projetoId: number, usuarioId: number, nivelAcessoId: number) {
    return ProjetoRepository.addUsuario(projetoId, usuarioId, nivelAcessoId);
  }

  static async updateUsuario(projetoId: number, usuarioId: number, nivelAcessoId: number) {
    return ProjetoRepository.updateUsuario(projetoId, usuarioId, nivelAcessoId);
  }

  static async removeUsuario(projetoId: number, usuarioId: number) {
    return ProjetoRepository.removeUsuario(projetoId, usuarioId);
  }

  static async listTarefas(projetoId: number) {
    return ProjetoRepository.listTarefas(projetoId);
  }
}