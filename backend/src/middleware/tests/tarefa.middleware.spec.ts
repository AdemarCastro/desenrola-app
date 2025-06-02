import { Request, Response, NextFunction } from 'express';
import { validateTarefaExists } from '../tarefa.middleware';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mPrisma = {
    tarefa: {
      findFirst: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('validateTarefaExists middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let prismaMock: any;

  beforeEach(() => {
    req = {
      params: { tarefaId: '1' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    prismaMock = new PrismaClient();
  });

  it('deve chamar next() se a tarefa for encontrada', async () => {
    prismaMock.tarefa.findFirst.mockResolvedValue({ id: 1 });

    await validateTarefaExists(req as Request, res as Response, next as NextFunction);

    expect(prismaMock.tarefa.findFirst).toHaveBeenCalledWith({
      where: { id: 1, apagado_em: null },
    });
    expect(next).toHaveBeenCalled();
  });

  it('deve retornar 404 se a tarefa não for encontrada', async () => {
    prismaMock.tarefa.findFirst.mockResolvedValue(null);

    await validateTarefaExists(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Tarefa não encontrada' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next com erro se o banco lançar uma exceção', async () => {
    const error = new Error('Erro no banco');
    prismaMock.tarefa.findFirst.mockRejectedValue(error);

    await validateTarefaExists(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith(error);
  });
});
