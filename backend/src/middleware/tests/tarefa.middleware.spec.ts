import { Request, Response, NextFunction } from 'express';
import {
  validateTarefaCreate,
  validateTarefaUpdate,
  validateTarefaExists,
} from '../tarefa.middleware';

import { validate } from 'class-validator';
import { PrismaClient } from '@prisma/client';

jest.mock('class-validator', () => ({
  validate: jest.fn(),
}));

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    tarefa: {
      findFirst: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('Tarefa Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    req = { body: {}, params: {} };
    mockStatus = jest.fn().mockReturnThis();
    mockJson = jest.fn();
    res = {
      status: mockStatus,
      json: mockJson,
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('validateTarefaCreate', () => {
    it('deve chamar next quando não há erros', async () => {
      (validate as jest.Mock).mockResolvedValue([]);
      await validateTarefaCreate(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 400 quando há erros de validação', async () => {
      const errors = [{ property: 'titulo', constraints: { isNotEmpty: 'Título não pode estar vazio' } }];
      (validate as jest.Mock).mockResolvedValue(errors);
      await validateTarefaCreate(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateTarefaUpdate', () => {
    it('deve chamar next quando não há erros', async () => {
      (validate as jest.Mock).mockResolvedValue([]);
      await validateTarefaUpdate(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 400 quando há erros de validação', async () => {
      const errors = [{ property: 'descricao', constraints: { isNotEmpty: 'Descrição não pode estar vazia' } }];
      (validate as jest.Mock).mockResolvedValue(errors);
      await validateTarefaUpdate(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateTarefaExists', () => {
    const mockPrisma = new PrismaClient();
    const tarefaValida = { id: 1, titulo: 'Tarefa A', apagado_em: null };

    it('deve chamar next se tarefa existir', async () => {
      req.params = { tarefaId: '1' };
      (mockPrisma.tarefa.findFirst as jest.Mock).mockResolvedValue(tarefaValida);
      await validateTarefaExists(req as Request, res as Response, next);
      expect(mockPrisma.tarefa.findFirst).toHaveBeenCalledWith({
        where: { id: 1, apagado_em: null },
      });
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 404 se tarefa não existir', async () => {
      req.params = { tarefaId: '999' };
      (mockPrisma.tarefa.findFirst as jest.Mock).mockResolvedValue(null);
      await validateTarefaExists(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Tarefa não encontrada' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
