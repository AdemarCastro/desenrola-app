import { Request, Response } from 'express';
import { ProjetoController } from '../projeto.controller';
import { ProjetoService } from '../../services/projeto.service';

jest.mock('../services/projeto.service');

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

describe('ProjetoController', () => {
  let req: Partial<Request>;
  let res: Response;

  beforeEach(() => {
    req = {};
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('getProjetos', () => {
    it('deve retornar lista de projetos com paginação', async () => {
      const projetos = [{ id: 1, nome: 'Projeto 1' }];
      (ProjetoService.prototype.findAll as jest.Mock).mockResolvedValue(projetos);

      req.query = { page: '1', limit: '5' };

      await ProjetoController.getProjetos(req as Request, res);

      expect(res.json).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        data: expect.any(Array),
      });
    });
  });

  describe('getProjetoById', () => {
    it('deve retornar projeto se encontrado', async () => {
      const projeto = { id: 1, nome: 'Projeto 1' };
      (ProjetoService.prototype.findById as jest.Mock).mockResolvedValue(projeto);
      req.params = { projetoId: '1' };

      await ProjetoController.getProjetoById(req as Request, res);

      expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });

    it('deve retornar 404 se projeto não encontrado', async () => {
      (ProjetoService.prototype.findById as jest.Mock).mockResolvedValue(null);
      req.params = { projetoId: '999' };

      await ProjetoController.getProjetoById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Projeto não encontrado' });
    });
  });

  describe('createProjeto', () => {
    it('deve criar e retornar projeto', async () => {
      const projetoCriado = { id: 1, nome: 'Novo Projeto' };
      (ProjetoService.prototype.create as jest.Mock).mockResolvedValue(projetoCriado);

      req.body = {
        nome: 'Novo Projeto',
        descricao: 'Descrição',
        data_entrega: '2025-07-01',
      };

      await ProjetoController.createProjeto(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('updateProjeto', () => {
    it('deve atualizar e retornar projeto', async () => {
      const projetoAtualizado = { id: 1, nome: 'Atualizado' };
      (ProjetoService.prototype.findById as jest.Mock).mockResolvedValue({ id: 1 });
      (ProjetoService.prototype.update as jest.Mock).mockResolvedValue(projetoAtualizado);

      req.params = { projetoId: '1' };
      req.body = { nome: 'Atualizado' };

      await ProjetoController.updateProjeto(req as Request, res);

      expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });

    it('deve retornar 404 se projeto não encontrado', async () => {
      (ProjetoService.prototype.findById as jest.Mock).mockResolvedValue(null);

      req.params = { projetoId: '999' };

      await ProjetoController.updateProjeto(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Projeto não encontrado' });
    });
  });

  describe('deleteProjeto', () => {
    it('deve deletar projeto se encontrado', async () => {
      (ProjetoService.prototype.findById as jest.Mock).mockResolvedValue({ id: 1 });
      (ProjetoService.prototype.delete as jest.Mock).mockResolvedValue(undefined);

      req.params = { projetoId: '1' };

      await ProjetoController.deleteProjeto(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve retornar 404 se projeto não encontrado', async () => {
      (ProjetoService.prototype.findById as jest.Mock).mockResolvedValue(null);

      req.params = { projetoId: '999' };

      await ProjetoController.deleteProjeto(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Projeto não encontrado' });
    });
  });

  describe('getProjetoUsuarios', () => {
    it('deve listar usuários do projeto', async () => {
      (ProjetoService.prototype.findById as jest.Mock).mockResolvedValue({ id: 1 });
      (ProjetoService.prototype.listUsuarios as jest.Mock).mockResolvedValue([{ id: 1 }]);

      req.params = { projetoId: '1' };

      await ProjetoController.getProjetoUsuarios(req as Request, res);

      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });
  });

  describe('addProjetoUsuario', () => {
    it('deve adicionar usuário ao projeto', async () => {
      const vinculo = { id_usuario: 1, projetoId: 1, nivel_id: 2 };
      (ProjetoService.prototype.addUsuario as jest.Mock).mockResolvedValue(vinculo);

      req.params = { projetoId: '1' };
      req.body = { id_usuario: 1, nivel_id: 2 };

      await ProjetoController.addProjetoUsuario(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(vinculo);
    });
  });

  describe('updateProjetoUsuario', () => {
    it('deve atualizar vínculo de usuário ao projeto', async () => {
      const updated = { id_usuario: 1, projetoId: 1, nivel_id: 3 };
      (ProjetoService.prototype.updateUsuario as jest.Mock).mockResolvedValue(updated);

      req.params = { projetoId: '1', usuarioId: '1' };
      req.body = { nivel_id: 3 };

      await ProjetoController.updateProjetoUsuario(req as Request, res);

      expect(res.json).toHaveBeenCalledWith(updated);
    });
  });

  describe('deleteProjetoUsuario', () => {
    it('deve remover usuário do projeto', async () => {
      (ProjetoService.prototype.removeUsuario as jest.Mock).mockResolvedValue(undefined);

      req.params = { projetoId: '1', usuarioId: '1' };

      await ProjetoController.deleteProjetoUsuario(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('getProjetoTarefas', () => {
    it('deve retornar tarefas do projeto', async () => {
      (ProjetoService.prototype.findById as jest.Mock).mockResolvedValue({ id: 1 });
      (ProjetoService.prototype.listTarefas as jest.Mock).mockResolvedValue([{ id: 1, titulo: 'Tarefa' }]);

      req.params = { projetoId: '1' };

      await ProjetoController.getProjetoTarefas(req as Request, res);

      expect(res.json).toHaveBeenCalledWith([{ id: 1, titulo: 'Tarefa' }]);
    });

    it('deve retornar 404 se projeto não encontrado', async () => {
      (ProjetoService.prototype.findById as jest.Mock).mockResolvedValue(null);
      req.params = { projetoId: '999' };

      await ProjetoController.getProjetoTarefas(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Projeto não encontrado' });
    });
  });
});
