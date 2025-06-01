import { Request, Response, NextFunction } from 'express';
import {
  validateComentarioCreate,
  validateComentarioUpdate,
  validateComentarioExists
} from '../comentario.middleware';

import { validate } from 'class-validator';
import { PrismaClient } from '@prisma/client';

jest.mock('class-validator', () => ({
  validate: jest.fn(),
}));

jest.mock('@prisma/client', () => {
  const mPrisma = {
    comentario: {
      findFirst: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('Comentario Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  const mockStatus = jest.fn().mockReturnThis();
  const mockJson = jest.fn();

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: mockStatus,
      json: mockJson,
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('validateComentarioCreate', () => {
    it('deve chamar next se não houver erros de validação', async () => {
      (validate as jest.Mock).mockResolvedValue([]);
      await validateComentarioCreate(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 400 se houver erros de validação', async () => {
      const errors = [{ property: 'texto', constraints: { isNotEmpty: 'texto não pode estar vazio' } }];
      (validate as jest.Mock).mockResolvedValue(errors);
      await validateComentarioCreate(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateComentarioUpdate', () => {
    it('deve chamar next se não houver erros de validação', async () => {
      (validate as jest.Mock).mockResolvedValue([]);
      await validateComentarioUpdate(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 400 se houver erros de validação', async () => {
      const errors = [{ property: 'texto', constraints: { isNotEmpty: 'texto não pode estar vazio' } }];
      (validate as jest.Mock).mockResolvedValue(errors);
      await validateComentarioUpdate(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateComentarioExists', () => {
    const mockPrisma = new PrismaClient();
    const comentarioMock = { id: 1, texto: 'comentário válido', apagado_em: null };

    it('deve chamar next se o comentário existir', async () => {
      req.params = { comentarioId: '1' };
      (mockPrisma.comentario.findFirst as jest.Mock).mockResolvedValue(comentarioMock);

      await validateComentarioExists(req as Request, res as Response, next);

      expect(mockPrisma.comentario.findFirst).toHaveBeenCalledWith({
        where: { id: 1, apagado_em: null },
      });
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 404 se o comentário não existir', async () => {
      req.params = { comentarioId: '1' };
      (mockPrisma.comentario.findFirst as jest.Mock).mockResolvedValue(null);

      await validateComentarioExists(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Comentário não encontrado' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
