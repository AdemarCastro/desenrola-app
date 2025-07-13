import { Request, Response } from "express";
import { TarefaService } from "../services/tarefa.service";

export class TarefaController {
  static async getTarefas(req: Request, res: Response): Promise<void> {
    res.json(await TarefaService.findAll());
  }

  static async getTarefaById(req: Request, res: Response): Promise<void> {
    const tarefa = await TarefaService.findById(Number(req.params.tarefaId));
    if (!tarefa) res.status(404).json({ error: "Tarefa não encontrada" });
    else res.json(tarefa);
  }

  static async createTarefa(req: Request, res: Response): Promise<void> {
    const tarefa = await TarefaService.create(req.body);
    res.status(201).json(tarefa);
  }

  static async updateTarefa(req: Request, res: Response): Promise<void> {
    const tarefa = await TarefaService.update(Number(req.params.tarefaId), req.body);
    res.json(tarefa);
  }

  static async deleteTarefa(req: Request, res: Response): Promise<void> {
    await TarefaService.delete(Number(req.params.tarefaId));
    res.status(204).send();
  }

  static async getComentariosByTarefa(req: Request, res: Response): Promise<void> {
    res.json(await TarefaService.getComentariosByTarefa(Number(req.params.tarefaId)));
  }
  
  static async getAnexos(req: Request, res: Response): Promise<void> {
    res.json(await TarefaService.getAnexosByTarefa(Number(req.params.tarefaId)));
  }

  static async createAnexo(req: Request, res: Response): Promise<void> {
    const tarefa = await TarefaService.adicionarAnexo(Number(req.params.tarefaId), req.body);
    if (!tarefa) res.status(404).json({ error: "Tarefa não encontrada" });
    else res.status(201).json(tarefa);
  }

  static async deleteAnexo(req: Request, res: Response): Promise<void> {
    await TarefaService.removerAnexo(Number(req.params.anexoId));
    res.status(204).send();
  }

  static async getResponsaveis(req: Request, res: Response): Promise<void> {
    res.json(await TarefaService.getResponsaveisByTarefa(Number(req.params.tarefaId)));
  }

  static async addResponsaveis(req: Request, res: Response): Promise<void> {
    await TarefaService.adicionarResponsaveis(Number(req.params.tarefaId), req.body.usuarioIds);
    res.status(201).send();
  }

  static async removerResponsavel(req: Request, res: Response): Promise<void> {
    await TarefaService.removerResponsavel(Number(req.params.tarefaId), Number(req.body.usuarioId));
    res.status(204).send();
  }
}