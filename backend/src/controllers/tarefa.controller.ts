import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTarefas(req: Request, res: Response) {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const tarefas = await prisma.tarefa.findMany({
    where: { apagado_em: null },
    skip,
    take: Number(limit),
  });

  res.json(tarefas);
}

export async function getTarefaById(req: Request, res: Response): Promise<void> {
  const { tarefaId } = req.params;

  const tarefa = await prisma.tarefa.findFirst({
    where: { id: Number(tarefaId), apagado_em: null },
  });

  if (!tarefa) {
    res.status(404).json({ error: 'Tarefa não encontrada' });
    return;
  }

  res.json(tarefa);
}

export async function createTarefa(req: Request, res: Response): Promise<void> {
  const { descricao, status_id, prioridade_id, id_projeto } = req.body;

  if (!descricao || !status_id || !prioridade_id || !id_projeto) {
    res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    return;
  }

  const tarefa = await prisma.tarefa.create({
    data: { descricao, status_id, prioridade_id, id_projeto },
  });

  res.status(201).json(tarefa);
}

export async function updateTarefa(req: Request, res: Response): Promise<void> {
  const { tarefaId } = req.params;
  const { descricao, status_id, prioridade_id } = req.body;

  const tarefa = await prisma.tarefa.findFirst({
    where: { id: Number(tarefaId), apagado_em: null },
  });

  if (!tarefa) {
    res.status(404).json({ error: 'Tarefa não encontrada' });
    return;
  }

  if (status_id) {
    const status = await prisma.statusTarefa.findUnique({ where: { id: status_id } });
    if (!status) {
      res.status(400).json({ error: 'ID de status inválido' });
      return;
    }
  }

  if (prioridade_id) {
    const prioridade = await prisma.prioridadeTarefa.findUnique({ where: { id: prioridade_id } });
    if (!prioridade) {
      res.status(400).json({ error: 'ID de prioridade inválido' });
      return;
    }
  }

  const updatedTarefa = await prisma.tarefa.update({
    where: { id: Number(tarefaId) },
    data: { descricao, status_id, prioridade_id },
  });

  res.json(updatedTarefa);
}

export async function deleteTarefa(req: Request, res: Response): Promise<void> {
  const { tarefaId } = req.params;

  const tarefa = await prisma.tarefa.findFirst({
    where: { id: Number(tarefaId), apagado_em: null },
  });

  if (!tarefa) {
    res.status(404).json({ error: 'Tarefa não encontrada' });
    return;
  }

  await prisma.tarefa.update({
    where: { id: Number(tarefaId) },
    data: { apagado_em: new Date() },
  });

  res.status(204).send();
}

export async function getComentariosByTarefa(req: Request, res: Response): Promise<void> {
  const { tarefaId } = req.params;

  const tarefa = await prisma.tarefa.findFirst({
    where: { id: Number(tarefaId), apagado_em: null },
  });

  if (!tarefa) {
    res.status(404).json({ error: 'Tarefa não encontrada' });
    return;
  }

  const comentarios = await prisma.comentario.findMany({
    where: { id_tarefa: Number(tarefaId), apagado_em: null },
  });

  res.json(comentarios);
}