import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ComentarioController {
  async getComentarios(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const comentarios = await prisma.comentario.findMany({
      where: { apagado_em: null },
      skip,
      take: Number(limit),
    });

    res.json(comentarios);
  }

  async getComentarioById(req: Request, res: Response): Promise<void> {
    const { comentarioId } = req.params;

    const comentario = await prisma.comentario.findFirst({
      where: { id: Number(comentarioId), apagado_em: null },
    });

    if (!comentario) {
      res.status(404).json({ error: 'Comentário não encontrado' });
      return;
    }

    res.json(comentario);
  }

  async createComentario(req: Request, res: Response): Promise<void> {
    const { conteudo, id_usuario, id_tarefa } = req.body;

    if (!conteudo || !id_usuario || !id_tarefa) {
      res.status(400).json({ error: 'Campos obrigatórios ausentes' });
      return;
    }

    const comentario = await prisma.comentario.create({
      data: { conteudo, id_usuario, id_tarefa },
    });

    res.status(201).json(comentario);
  }

  async updateComentario(req: Request, res: Response): Promise<void> {
    const { comentarioId } = req.params;
    const { conteudo } = req.body;

    const comentario = await prisma.comentario.findFirst({
      where: { id: Number(comentarioId), apagado_em: null },
    });

    if (!comentario) {
      res.status(404).json({ error: 'Comentário não encontrado' });
      return;
    }

    const updatedComentario = await prisma.comentario.update({
      where: { id: Number(comentarioId) },
      data: { conteudo },
    });

    res.json(updatedComentario);
  }

  async deleteComentario(req: Request, res: Response): Promise<void> {
    const { comentarioId } = req.params;

    const comentario = await prisma.comentario.findFirst({
      where: { id: Number(comentarioId), apagado_em: null },
    });

    if (!comentario) {
      res.status(404).json({ error: 'Comentário não encontrado' });
      return;
    }

    await prisma.comentario.update({
      where: { id: Number(comentarioId) },
      data: { apagado_em: new Date() },
    });

    res.status(204).send();
  }
}