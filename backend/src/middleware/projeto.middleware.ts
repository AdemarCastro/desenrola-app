import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateProjetoInputDto, UpdateProjetoInputDto } from '../dtos/projeto/ProjetoInput.dto';

const prisma = new PrismaClient();

export async function validateProjetoCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const dto = plainToInstance(CreateProjetoInputDto, req.body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
}

export async function validateProjetoUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const dto = plainToInstance(UpdateProjetoInputDto, req.body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
}

export async function validateProjetoExists(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id = Number(req.params.projetoId);
  const proj = await prisma.projeto.findFirst({ where: { id, apagado_em: null } });
  if (!proj) {
    res.status(404).json({ error: 'Projeto não encontrado' });
    return;
  }
  next();
}