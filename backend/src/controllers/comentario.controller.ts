import { Request, Response } from "express";
import { ComentarioService } from "../services/comentario.service";

export class ComentarioController {
  static async getComentarios(req: Request, res: Response): Promise<void> {
    const comentarios = await ComentarioService.findAll();

    if (!comentarios) {
      res.status(404).json({ error: "Comentários não encontrado" });
      return;
    }

    res.json(comentarios);
  }

  static async getComentarioById(req: Request, res: Response): Promise<void> {
    const { comentarioId } = req.params;

    const comentario = await ComentarioService.findById(Number(comentarioId));

    if (!comentario) {
      res.status(404).json({ error: "Comentário não encontrado" });
      return;
    }

    res.json(comentario);
  }

  static async createComentario(req: Request, res: Response): Promise<void> {
    const { conteudo, id_usuario, id_tarefa } = req.body;

    const comentario = await ComentarioService.create({ conteudo, id_usuario, id_tarefa });

    res.status(201).json(comentario);
  }

  static async updateComentario(req: Request, res: Response): Promise<void> {
    const { comentarioId } = req.params;
    const { conteudo } = req.body;

    const comentario = await ComentarioService.update(Number(comentarioId), { conteudo });

    res.json(comentario);
  }

  static async deleteComentario(req: Request, res: Response): Promise<void> {
    const { comentarioId } = req.params;

    await ComentarioService.delete(Number(comentarioId));

    res.status(204).send();
  }
}