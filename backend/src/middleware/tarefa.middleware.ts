import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function validateTarefaExists(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { tarefaId } = req.params;
  
  try {
    const tarefa = await prisma.tarefa.findFirst({
      where: { id: Number(tarefaId), apagado_em: null },
    });

    if (!tarefa) {
      res.status(404).json({ error: 'Tarefa não encontrada' });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}