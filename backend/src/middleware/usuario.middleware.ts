import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUsuarioInputDTO } from '../dtos/usuario/CreateUsuarioInput.dto';
import { UpdateUsuarioInputDTO } from '../dtos/usuario/UpdateUsuarioInput.dto';

const prisma = new PrismaClient();

export class UsuarioMiddleware {
  static async validateUsuarioCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dto = plainToInstance(CreateUsuarioInputDTO, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }
    next();
  }

  static async validateUsuarioUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dto = plainToInstance(UpdateUsuarioInputDTO, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }
    next();
  }

  static async validateUsuarioExists(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = Number(req.params.usuarioId);
    const usuario = await prisma.usuario.findFirst({ where: { id, apagado_em: null } });
    if (!usuario) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }
    next();
  }
}