import { Request, Response } from 'express';
import { ProjetoService } from '../services/projeto.service';
import { plainToInstance } from 'class-transformer';
import { ProjetoOutputDto } from '../dtos/projeto/ProjetoOutput.dto';

const service = new ProjetoService();

export class ProjetoController {
  static async getProjetos(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await service.findAll(page, limit);

    res.json({
      page,
      limit,
      data: plainToInstance(ProjetoOutputDto, data),
    });
  }

  static async getProjetoById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.projetoId);
    const projeto = await service.findById(id);

    if (!projeto) {
      res.status(404).json({ error: 'Projeto não encontrado' });
      return;
    }

    res.json(plainToInstance(ProjetoOutputDto, projeto));
  }

  static async createProjeto(req: Request, res: Response): Promise<void> {
    const { nome, descricao, data_entrega } = req.body;

    const dtoIn: {
      nome: string;
      descricao?: string;
      data_entrega?: Date;
    } = {
      nome,
      ...(descricao !== undefined && { descricao }),
      ...(data_entrega ? { data_entrega: new Date(data_entrega) } : {}),
    };

    const projeto = await service.create(dtoIn);

    res.status(201).json(plainToInstance(ProjetoOutputDto, projeto));
  }

  static async updateProjeto(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.projetoId);
    const existing = await service.findById(id);

    if (!existing) {
      res.status(404).json({ error: 'Projeto não encontrado' });
      return;
    }

    const updates: {
      nome?: string;
      descricao?: string;
      data_entrega?: Date;
    } = {};

    if (req.body.nome !== undefined) updates.nome = req.body.nome;
    if (req.body.descricao !== undefined) updates.descricao = req.body.descricao;
    if (req.body.data_entrega !== undefined && req.body.data_entrega) {
      updates.data_entrega = new Date(req.body.data_entrega);
    }

    const projeto = await service.update(id, updates);

    res.json(plainToInstance(ProjetoOutputDto, projeto));
  }

  static async deleteProjeto(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.projetoId);
    const existing = await service.findById(id);

    if (!existing) {
      res.status(404).json({ error: 'Projeto não encontrado' });
      return;
    }

    await service.delete(id);

    res.status(204).send();
  }

  static async getProjetoUsuarios(req: Request, res: Response): Promise<void> {
    const projetoId = Number(req.params.projetoId);
    const existing = await service.findById(projetoId);

    if (!existing) {
      res.status(404).json({ error: 'Projeto não encontrado' });
      return;
    }

    const usuarios = await service.listUsuarios(projetoId);

    res.json(usuarios);
  }

  static async addProjetoUsuario(req: Request, res: Response): Promise<void> {
    const projetoId = Number(req.params.projetoId);
    const { id_usuario, nivel_id } = req.body;

    const vinculo = await service.addUsuario(projetoId, id_usuario, nivel_id);

    res.status(201).json(vinculo);
  }

  static async updateProjetoUsuario(req: Request, res: Response): Promise<void> {
    const projetoId = Number(req.params.projetoId);
    const usuarioId = Number(req.params.usuarioId);
    const { nivel_id } = req.body;

    const updated = await service.updateUsuario(projetoId, usuarioId, nivel_id);

    res.json(updated);
  }

  static async deleteProjetoUsuario(req: Request, res: Response): Promise<void> {
    const projetoId = Number(req.params.projetoId);
    const usuarioId = Number(req.params.usuarioId);

    await service.removeUsuario(projetoId, usuarioId);

    res.status(204).send();
  }

  static async getProjetoTarefas(req: Request, res: Response): Promise<void> {
    const projetoId = Number(req.params.projetoId);
    const existing = await service.findById(projetoId);

    if (!existing) {
      res.status(404).json({ error: 'Projeto não encontrado' });
      return;
    }

    const tarefas = await service.listTarefas(projetoId);

    res.json(tarefas);
  }
}