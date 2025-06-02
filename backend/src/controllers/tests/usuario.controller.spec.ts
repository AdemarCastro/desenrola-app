import { UsuarioController } from '../usuario.controller';
import { UsuarioService } from '../../services/usuario.service';
import { Request, Response } from 'express';

jest.mock('../services/usuario.service');

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

const mockRequest = (params = {}, body = {}, query = {}): Request =>
  ({
    params,
    body,
    query,
  } as unknown as Request);

describe('UsuarioController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsuarios', () => {
    it('deve retornar todos os usuários', async () => {
      const res = mockResponse();
      const usuarios = [{ id: 1, nome: 'João' }];
      (UsuarioService.findAll as jest.Mock).mockResolvedValue(usuarios);

      await UsuarioController.getUsuarios(mockRequest(), res);

      expect(res.json).toHaveBeenCalledWith(usuarios);
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      const res = mockResponse();
      (UsuarioService.findAll as jest.Mock).mockRejectedValue(new Error());

      await UsuarioController.getUsuarios(mockRequest(), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar usuários' });
    });
  });

  describe('getUsuarioById', () => {
    it('deve retornar o usuário se encontrado', async () => {
      const res = mockResponse();
      const usuario = { id: 1, nome: 'Maria' };
      (UsuarioService.findById as jest.Mock).mockResolvedValue(usuario);

      await UsuarioController.getUsuarioById(mockRequest({ usuarioId: '1' }), res);

      expect(res.json).toHaveBeenCalledWith(usuario);
    });

    it('deve retornar 404 se não encontrado', async () => {
      const res = mockResponse();
      (UsuarioService.findById as jest.Mock).mockResolvedValue(null);

      await UsuarioController.getUsuarioById(mockRequest({ usuarioId: '1' }), res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuário não encontrado' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      const res = mockResponse();
      (UsuarioService.findById as jest.Mock).mockRejectedValue(new Error());

      await UsuarioController.getUsuarioById(mockRequest({ usuarioId: '1' }), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar usuário' });
    });
  });

  describe('createUsuario', () => {
    it('deve criar um novo usuário', async () => {
      const res = mockResponse();
      const body = { nome: 'Novo Usuário' };
      const created = { id: 1, nome: 'Novo Usuário' };
      (UsuarioService.createUsuario as jest.Mock).mockResolvedValue(created);

      await UsuarioController.createUsuario(mockRequest({}, body), res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });

    it('deve retornar 500 em caso de erro', async () => {
      const res = mockResponse();
      (UsuarioService.createUsuario as jest.Mock).mockRejectedValue(new Error());

      await UsuarioController.createUsuario(mockRequest({}, { nome: 'Teste' }), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar usuário' });
    });
  });

  describe('updateUsuario', () => {
    it('deve atualizar o usuário', async () => {
      const res = mockResponse();
      const update = { nome: 'Atualizado' };
      const updated = { id: 1, nome: 'Atualizado' };
      (UsuarioService.updateUsuario as jest.Mock).mockResolvedValue(updated);

      await UsuarioController.updateUsuario(mockRequest({ usuarioId: '1' }, update), res);

      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('deve retornar 500 em caso de erro', async () => {
      const res = mockResponse();
      (UsuarioService.updateUsuario as jest.Mock).mockRejectedValue(new Error());

      await UsuarioController.updateUsuario(mockRequest({ usuarioId: '1' }, { nome: 'X' }), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar usuário' });
    });
  });

  describe('deleteUsuario', () => {
    it('deve deletar o usuário', async () => {
      const res = mockResponse();
      (UsuarioService.deleteUsuario as jest.Mock).mockResolvedValue(undefined);

      await UsuarioController.deleteUsuario(mockRequest({ usuarioId: '1' }), res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve retornar 500 em caso de erro', async () => {
      const res = mockResponse();
      (UsuarioService.deleteUsuario as jest.Mock).mockRejectedValue(new Error());

      await UsuarioController.deleteUsuario(mockRequest({ usuarioId: '1' }), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao deletar usuário' });
    });
  });
});
