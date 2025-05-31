import { Request, Response } from 'express';
import * as usuarioController from '../usuario.controller';
import * as usuarioService from '../../services/usuario.service';

jest.mock('../../services/usuario.service');

describe('Usuario Controller', () => {
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

  describe('createUsuarioController', () => {
    it('deve criar usuário com sucesso e retornar 201', async () => {
      const mockDto = { id: 1, nome: 'Usuário Teste' };
      (usuarioService.createUsuario as jest.Mock).mockResolvedValue(mockDto);
      req.body = { nome: 'Usuário Teste' };

      await usuarioController.createUsuarioController(req as Request, res as Response);

      expect(usuarioService.createUsuario).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockDto);
    });

    it('deve retornar 500 em caso de erro', async () => {
      (usuarioService.createUsuario as jest.Mock).mockRejectedValue(new Error('Erro'));
      req.body = { nome: 'Usuário Teste' };

      await usuarioController.createUsuarioController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar usuário' });
    });
  });

  describe('updateUsuarioController', () => {
    it('deve atualizar usuário com sucesso e retornar dto', async () => {
      const mockDto = { id: 1, nome: 'Usuário Atualizado' };
      (usuarioService.updateUsuario as jest.Mock).mockResolvedValue(mockDto);
      req.params = { id: '1' };
      req.body = { nome: 'Usuário Atualizado' };

      await usuarioController.updateUsuarioController(req as Request, res as Response);

      expect(usuarioService.updateUsuario).toHaveBeenCalledWith(1, req.body);
      expect(res.json).toHaveBeenCalledWith(mockDto);
    });

    it('deve retornar 500 em caso de erro', async () => {
      (usuarioService.updateUsuario as jest.Mock).mockRejectedValue(new Error('Erro'));
      req.params = { id: '1' };
      req.body = { nome: 'Usuário Atualizado' };

      await usuarioController.updateUsuarioController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar usuário' });
    });
  });

  describe('deleteUsuarioController', () => {
    it('deve deletar usuário e retornar 204', async () => {
      (usuarioService.deleteUsuario as jest.Mock).mockResolvedValue(undefined);
      req.params = { id: '1' };

      await usuarioController.deleteUsuarioController(req as Request, res as Response);

      expect(usuarioService.deleteUsuario).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve retornar 500 em caso de erro', async () => {
      (usuarioService.deleteUsuario as jest.Mock).mockRejectedValue(new Error('Erro'));
      req.params = { id: '1' };

      await usuarioController.deleteUsuarioController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao deletar usuário' });
    });
  });
});
