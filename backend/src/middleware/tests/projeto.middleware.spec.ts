import { Request, Response, NextFunction } from 'express';
import {
  validateProjetoCreate,
  validateProjetoUpdate,
  validateProjetoExists,
} from '../projeto.middleware';

import { validate } from 'class-validator';
import { PrismaClient } from '@prisma/client';

jest.mock('class-validator', () => ({
  validate: jest.fn(),
}));

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    projeto: {
      findFirst: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('Projeto Middleware', () => {
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

  describe('validateProjetoCreate', () => {
    it('deve chamar next quando não há erros', async () => {
      (validate as jest.Mock).mockResolvedValue([]);
      await validateProjetoCreate(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 400 quando há erros de validação', async () => {
      const errors = [{ property: 'nome', constraints: { isNotEmpty: 'nome não pode estar vazio' } }];
      (validate as jest.Mock).mockResolvedValue(errors);
      await validateProjetoCreate(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateProjetoUpdate', () => {
    it('deve chamar next quando não há erros', async () => {
      (validate as jest.Mock).mockResolvedValue([]);
      await validateProjetoUpdate(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 400 quando há erros de validação', async () => {
      const errors = [{ property: 'descricao', constraints: { isNotEmpty: 'descrição não pode estar vazia' } }];
      (validate as jest.Mock).mockResolvedValue(errors);
      await validateProjetoUpdate(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateProjetoExists', () => {
    const mockPrisma = new PrismaClient();
    const projetoValido = { id: 1, nome: 'Projeto A', apagado_em: null };

    it('deve chamar next se projeto existir', async () => {
      req.params = { projetoId: '1' };
      (mockPrisma.projeto.findFirst as jest.Mock).mockResolvedValue(projetoValido);
      await validateProjetoExists(req as Request, res as Response, next);
      expect(mockPrisma.projeto.findFirst).toHaveBeenCalledWith({
        where: { id: 1, apagado_em: null },
      });
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 404 se projeto não existir', async () => {
      req.params = { projetoId: '99' };
      (mockPrisma.projeto.findFirst as jest.Mock).mockResolvedValue(null);
      await validateProjetoExists(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Projeto não encontrado' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
