import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTarefaInputDto, UpdateTarefaInputDto } from '../dtos/tarefa/TarefaInput.dto';

const prisma = new PrismaClient();

export async function validateTarefaCreate(req: Request, res: Response, next: NextFunction) {
  const tarefaDto = plainToInstance(CreateTarefaInputDto, req.body);
  const errors = await validate(tarefaDto);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

export async function validateTarefaUpdate(req: Request, res: Response, next: NextFunction) {
  const tarefaDto = plainToInstance(UpdateTarefaInputDto, req.body);
  const errors = await validate(tarefaDto);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

export async function validateTarefaExists(req: Request, res: Response, next: NextFunction) {
  const { tarefaId } = req.params;
  const tarefa = await prisma.tarefa.findFirst({
    where: { id: Number(tarefaId), apagado_em: null },
  });

  if (!tarefa) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }

  next();
}