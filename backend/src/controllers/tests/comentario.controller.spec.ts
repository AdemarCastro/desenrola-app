import { ComentarioController } from '../comentario.controller';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

jest.mock('@prisma/client', () => {
  const mPrisma = {
    comentario: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
const controller = new ComentarioController();

const mockResponse = (): jest.Mocked<Response> => {
  const res = {} as jest.Mocked<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('ComentarioController', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getComentarios', () => {
    it('deve retornar lista de comentários', async () => {
      const req = { query: {} } as Request;
      const res = mockResponse();
      const comentarios = [{ id: 1, conteudo: 'Comentário A' }];

      mockPrisma.comentario.findMany.mockResolvedValue(comentarios);

      await controller.getComentarios(req, res);

      expect(mockPrisma.comentario.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(comentarios);
    });
  });

  describe('getComentarioById', () => {
    it('deve retornar um comentário existente', async () => {
      const req = { params: { comentarioId: '1' } } as unknown as Request;
      const res = mockResponse();
      const comentario = { id: 1, conteudo: 'Comentário A' };

      mockPrisma.comentario.findFirst.mockResolvedValue(comentario);

      await controller.getComentarioById(req, res);

      expect(mockPrisma.comentario.findFirst).toHaveBeenCalledWith({
        where: { id: 1, apagado_em: null },
      });
      expect(res.json).toHaveBeenCalledWith(comentario);
    });

    it('deve retornar 404 se comentário não existir', async () => {
      const req = { params: { comentarioId: '1' } } as unknown as Request;
      const res = mockResponse();

      mockPrisma.comentario.findFirst.mockResolvedValue(null);

      await controller.getComentarioById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Comentário não encontrado' });
    });
  });

  describe('createComentario', () => {
    it('deve criar um novo comentário', async () => {
      const req = {
        body: { conteudo: 'Novo', id_usuario: 1, id_tarefa: 2 },
      } as Request;
      const res = mockResponse();

      const created = { id: 1, conteudo: 'Novo' };
      mockPrisma.comentario.create.mockResolvedValue(created);

      await controller.createComentario(req, res);

      expect(mockPrisma.comentario.create).toHaveBeenCalledWith({
        data: { conteudo: 'Novo', id_usuario: 1, id_tarefa: 2 },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });

    it('deve retornar 400 se dados estiverem ausentes', async () => {
      const req = { body: {} } as Request;
      const res = mockResponse();

      await controller.createComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Campos obrigatórios ausentes' });
    });
  });

  describe('updateComentario', () => {
    it('deve atualizar um comentário existente', async () => {
      const req = {
        params: { comentarioId: '1' },
        body: { conteudo: 'Atualizado' },
      } as unknown as Request;
      const res = mockResponse();

      const comentario = { id: 1, conteudo: 'Antigo' };
      const updated = { id: 1, conteudo: 'Atualizado' };

      mockPrisma.comentario.findFirst.mockResolvedValue(comentario);
      mockPrisma.comentario.update.mockResolvedValue(updated);

      await controller.updateComentario(req, res);

      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('deve retornar 404 se comentário não existir', async () => {
      const req = {
        params: { comentarioId: '1' },
        body: { conteudo: 'Atualizado' },
      } as unknown as Request;
      const res = mockResponse();

      mockPrisma.comentario.findFirst.mockResolvedValue(null);

      await controller.updateComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Comentário não encontrado' });
    });
  });

  describe('deleteComentario', () => {
    it('deve deletar (marcar como apagado) um comentário existente', async () => {
      const req = { params: { comentarioId: '1' } } as unknown as Request;
      const res = mockResponse();

      const comentario = { id: 1, conteudo: 'Teste' };
      mockPrisma.comentario.findFirst.mockResolvedValue(comentario);
      mockPrisma.comentario.update.mockResolvedValue({ ...comentario, apagado_em: new Date() });

      await controller.deleteComentario(req, res);

      expect(mockPrisma.comentario.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve retornar 404 se comentário não existir', async () => {
      const req = { params: { comentarioId: '1' } } as unknown as Request;
      const res = mockResponse();

      mockPrisma.comentario.findFirst.mockResolvedValue(null);

      await controller.deleteComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Comentário não encontrado' });
    });
  });
});
