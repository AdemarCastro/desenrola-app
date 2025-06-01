import { Request, Response } from 'express';
import * as tarefaController from '../tarefa.controller'; // ajuste o caminho se necessário
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client');

const prismaMock = {
  tarefa: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  statusTarefa: {
    findUnique: jest.fn(),
  },
  prioridadeTarefa: {
    findUnique: jest.fn(),
  },
  comentario: {
    findMany: jest.fn(),
  },
};

(tarefaController as any).prisma = prismaMock;

describe('Tarefa Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('getTarefas', () => {
    it('deve retornar lista de tarefas com paginação', async () => {
      req.query = { page: '2', limit: '5' };

      const tarefasMock = [{ id: 1, descricao: 'Tarefa 1' }];
      prismaMock.tarefa.findMany.mockResolvedValue(tarefasMock);

      await tarefaController.getTarefas(req as Request, res as Response);

      expect(prismaMock.tarefa.findMany).toHaveBeenCalledWith({
        where: { apagado_em: null },
        skip: 5,
        take: 5,
      });
      expect(res.json).toHaveBeenCalledWith(tarefasMock);
    });
  });

  describe('getTarefaById', () => {
    it('deve retornar tarefa por id', async () => {
      req.params = { tarefaId: '1' };
      const tarefaMock = { id: 1, descricao: 'Tarefa 1' };
      prismaMock.tarefa.findFirst.mockResolvedValue(tarefaMock);

      await tarefaController.getTarefaById(req as Request, res as Response);

      expect(prismaMock.tarefa.findFirst).toHaveBeenCalledWith({
        where: { id: 1, apagado_em: null },
      });
      expect(res.json).toHaveBeenCalledWith(tarefaMock);
    });

    it('deve retornar 404 se tarefa não existir', async () => {
      req.params = { tarefaId: '999' };
      prismaMock.tarefa.findFirst.mockResolvedValue(null);

      await tarefaController.getTarefaById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Tarefa não encontrada' });
    });
  });

  describe('createTarefa', () => {
    it('deve criar uma nova tarefa com dados válidos', async () => {
      req.body = {
        descricao: 'Nova tarefa',
        status_id: 1,
        prioridade_id: 2,
        id_projeto: 3,
      };

      const tarefaCriada = { id: 1, ...req.body };
      prismaMock.tarefa.create.mockResolvedValue(tarefaCriada);

      await tarefaController.createTarefa(req as Request, res as Response);

      expect(prismaMock.tarefa.create).toHaveBeenCalledWith({
        data: req.body,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(tarefaCriada);
    });

    it('deve retornar 400 se faltar campos obrigatórios', async () => {
      req.body = { descricao: 'Falha' }; // faltando outros campos

      await tarefaController.createTarefa(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Campos obrigatórios ausentes' });
    });
  });

  describe('updateTarefa', () => {
    it('deve atualizar tarefa existente com dados válidos', async () => {
      req.params = { tarefaId: '1' };
      req.body = { descricao: 'Atualizado', status_id: 1, prioridade_id: 2 };

      prismaMock.tarefa.findFirst.mockResolvedValue({ id: 1, apagado_em: null });
      prismaMock.statusTarefa.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.prioridadeTarefa.findUnique.mockResolvedValue({ id: 2 });
      prismaMock.tarefa.update.mockResolvedValue({ id: 1, ...req.body });

      await tarefaController.updateTarefa(req as Request, res as Response);

      expect(prismaMock.tarefa.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: req.body,
      });
      expect(res.json).toHaveBeenCalledWith({ id: 1, ...req.body });
    });

    it('deve retornar 404 se tarefa não existir', async () => {
      req.params = { tarefaId: '999' };
      prismaMock.tarefa.findFirst.mockResolvedValue(null);

      await tarefaController.updateTarefa(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Tarefa não encontrada' });
    });

    it('deve retornar 400 se status_id inválido', async () => {
      req.params = { tarefaId: '1' };
      req.body = { status_id: 99 };

      prismaMock.tarefa.findFirst.mockResolvedValue({ id: 1, apagado_em: null });
      prismaMock.statusTarefa.findUnique.mockResolvedValue(null);

      await tarefaController.updateTarefa(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID de status inválido' });
    });

    it('deve retornar 400 se prioridade_id inválido', async () => {
      req.params = { tarefaId: '1' };
      req.body = { prioridade_id: 99 };

      prismaMock.tarefa.findFirst.mockResolvedValue({ id: 1, apagado_em: null });
      prismaMock.statusTarefa.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.prioridadeTarefa.findUnique.mockResolvedValue(null);

      await tarefaController.updateTarefa(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID de prioridade inválido' });
    });
  });

  describe('deleteTarefa', () => {
    it('deve marcar tarefa como apagada', async () => {
      req.params = { tarefaId: '1' };

      prismaMock.tarefa.findFirst.mockResolvedValue({ id: 1, apagado_em: null });
      prismaMock.tarefa.update.mockResolvedValue({ id: 1, apagado_em: new Date() });

      await tarefaController.deleteTarefa(req as Request, res as Response);

      expect(prismaMock.tarefa.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { apagado_em: expect.any(Date) },
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve retornar 404 se tarefa não existir', async () => {
      req.params = { tarefaId: '999' };
      prismaMock.tarefa.findFirst.mockResolvedValue(null);

      await tarefaController.deleteTarefa(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Tarefa não encontrada' });
    });
  });

  describe('getComentariosByTarefa', () => {
    it('deve retornar comentários da tarefa', async () => {
      req.params = { tarefaId: '1' };
      const comentariosMock = [
        { id: 1, texto: 'Comentário 1', apagado_em: null },
        { id: 2, texto: 'Comentário 2', apagado_em: null },
      ];
      prismaMock.tarefa.findFirst.mockResolvedValue({ id: 1, apagado_em: null });
      prismaMock.comentario.findMany.mockResolvedValue(comentariosMock);

      await tarefaController.getComentariosByTarefa(req as Request, res as Response);

      expect(prismaMock.comentario.findMany).toHaveBeenCalledWith({
        where: { id_tarefa: 1, apagado_em: null },
      });
      expect(res.json).toHaveBeenCalledWith(comentariosMock);
    });

    it('deve retornar 404 se tarefa não existir', async () => {
      req.params = { tarefaId: '999' };
      prismaMock.tarefa.findFirst.mockResolvedValue(null);

      await tarefaController.getComentariosByTarefa(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Tarefa não encontrada' });
    });
  });
});
