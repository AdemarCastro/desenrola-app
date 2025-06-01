import { ProjetoController } from '../projeto.controller';
import { ProjetoService } from '../../services/projeto.service';
import { Request, Response } from 'express';
import { ProjetoOutputDto } from '../../dtos/projeto/ProjetoOutput.dto';

jest.mock('../services/projeto.service');
const MockedProjetoService = ProjetoService as jest.MockedClass<typeof ProjetoService>;

describe('ProjetoController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock, send: jest.fn() });

    req = {};
    res = {
      json: jsonMock,
      status: statusMock,
      send: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe('getProjetos', () => {
    it('should return a paginated list of projetos', async () => {
      const fakeData = [{ id: 1, nome: 'Projeto Teste' }];
      MockedProjetoService.prototype.findAll.mockResolvedValueOnce(fakeData);

      req.query = { page: '1', limit: '5' };

      await ProjetoController.getProjetos(req as Request, res as Response);

      expect(MockedProjetoService.prototype.findAll).toHaveBeenCalledWith(1, 5);
      expect(jsonMock).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        data: expect.any(Array),
      });
    });
  });

  describe('getProjetoById', () => {
    it('should return a projeto by id', async () => {
      const projeto = { id: 1, nome: 'Projeto' };
      MockedProjetoService.prototype.findById.mockResolvedValueOnce(projeto);

      req.params = { projetoId: '1' };

      await ProjetoController.getProjetoById(req as Request, res as Response);

      expect(MockedProjetoService.prototype.findById).toHaveBeenCalledWith(1);
      expect(jsonMock).toHaveBeenCalledWith(expect.any(ProjetoOutputDto));
    });

    it('should return 404 if projeto not found', async () => {
      MockedProjetoService.prototype.findById.mockResolvedValueOnce(null);

      req.params = { projetoId: '1' };

      await ProjetoController.getProjetoById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Projeto não encontrado' });
    });
  });

  describe('createProjeto', () => {
    it('should create a new projeto', async () => {
      const novoProjeto = { id: 1, nome: 'Novo Projeto' };
      MockedProjetoService.prototype.create.mockResolvedValueOnce(novoProjeto);

      req.body = { nome: 'Novo Projeto', descricao: '...', data_entrega: '2025-12-31' };

      await ProjetoController.createProjeto(req as Request, res as Response);

      expect(MockedProjetoService.prototype.create).toHaveBeenCalledWith({
        nome: 'Novo Projeto',
        descricao: '...',
        data_entrega: new Date('2025-12-31'),
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(expect.any(ProjetoOutputDto));
    });
  });

  describe('deleteProjeto', () => {
    it('should delete a projeto if exists', async () => {
      MockedProjetoService.prototype.findById.mockResolvedValueOnce({ id: 1 });
      MockedProjetoService.prototype.delete.mockResolvedValueOnce();

      req.params = { projetoId: '1' };

      await ProjetoController.deleteProjeto(req as Request, res as Response);

      expect(MockedProjetoService.prototype.delete).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should return 404 if projeto does not exist', async () => {
      MockedProjetoService.prototype.findById.mockResolvedValueOnce(null);

      req.params = { projetoId: '1' };

      await ProjetoController.deleteProjeto(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Projeto não encontrado' });
    });
  });
});
