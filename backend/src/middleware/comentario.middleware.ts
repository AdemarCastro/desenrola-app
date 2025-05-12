import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateComentarioInputDto, UpdateComentarioInputDto } from '../dtos/comentario/Comentario.input.dto';



const prisma = new PrismaClient();

export async function validateComentarioCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const comentarioDto = plainToInstance(CreateComentarioInputDto, req.body);
  const errors = await validate(comentarioDto);

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}

export async function validateComentarioUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const comentarioDto = plainToInstance(UpdateComentarioInputDto, req.body);
  const errors = await validate(comentarioDto);

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}

export async function validateComentarioExists(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { comentarioId } = req.params;
  const comentario = await prisma.comentario.findFirst({
    where: { id: Number(comentarioId), apagado_em: null },
  });

  if (!comentario) {
    res.status(404).json({ error: 'Comentário não encontrado' });
    return;
  }

  next();
}