import { Request, Response } from "express";
import { TarefaService } from "../services/tarefa.service";

export class TarefaController {
  static async getTarefas(req: Request, res: Response): Promise<void> {
    const tarefas = await TarefaService.findAll();
    res.json(tarefas);
  }

  static async getTarefaById(req: Request, res: Response): Promise<void> {
    const { tarefaId } = req.params;

    const tarefa = await TarefaService.findById(Number(tarefaId));

    if (!tarefa) {
      res.status(404).json({ error: "Tarefa não encontrada" });
      return;
    }

    res.json(tarefa);
  }

  static async createTarefa(req: Request, res: Response): Promise<void> {
    const { descricao, status_id, prioridade_id, id_projeto } = req.body;

    const tarefa = await TarefaService.create({ descricao, status_id, prioridade_id, id_projeto });

    res.status(201).json(tarefa);
  }

  static async updateTarefa(req: Request, res: Response): Promise<void> {
    const { tarefaId } = req.params;
    const { descricao, status_id, prioridade_id } = req.body;

    const tarefa = await TarefaService.update(Number(tarefaId), { descricao, status_id, prioridade_id });

    res.json(tarefa);
  }

  static async deleteTarefa(req: Request, res: Response): Promise<void> {
    const { tarefaId } = req.params;

    await TarefaService.delete(Number(tarefaId));

    res.status(204).send();
  }

  static async getComentariosByTarefa(req: Request, res: Response): Promise<void> {
    const { tarefaId } = req.params;

    const comentarios = await TarefaService.getComentariosByTarefa(Number(tarefaId));

    res.json(comentarios);
  }
}