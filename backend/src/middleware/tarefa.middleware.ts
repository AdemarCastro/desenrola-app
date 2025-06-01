import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateTarefaInputDto, UpdateTarefaInputDto } from "../dtos/tarefa/TarefaInput.dto";

const prisma = new PrismaClient();

export class TarefaMiddleware {
  static async validateTarefaCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dto = plainToInstance(CreateTarefaInputDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }
    next();
  }

  static async validateTarefaUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dto = plainToInstance(UpdateTarefaInputDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }
    next();
  }

  static async validateTarefaExists(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = Number(req.params.tarefaId);
    const tarefa = await prisma.tarefa.findFirst({
      where: { id, apagado_em: null },
    });
    if (!tarefa) {
      res.status(404).json({ error: "Tarefa não encontrada" });
      return;
    }
    next();
  }
}