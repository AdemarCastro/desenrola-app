import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createUsuario, updateUsuario, deleteUsuario } from '../usuario.service';
import { CreateUsuarioInputDTO } from '../../dtos/usuario/CreateUsuarioInput.dto';
import { UpdateUsuarioInputDTO } from '../../dtos/usuario/UpdateUsuarioInput.dto';
import { UsuarioOutputDTO } from '../../dtos/usuario/UsuarioOutput.dto';

jest.mock('@prisma/client', () => {
  const mPrisma = {
    usuario: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

jest.mock('bcrypt');

const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('UsuarioService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUsuario', () => {
    it('deve criar um usuário com senha criptografada', async () => {
      const dto: CreateUsuarioInputDTO = {
        email: 'teste@exemplo.com',
        primeiro_nome: 'Teste',
        sobrenome: 'Exemplo',
        senha: 'senha123',
        data_nascimento: '1990-01-01',
        idade: 33,
        status_id: 1,
      };

      const hashedPassword = 'hashedsenha123';
      const usuarioCriado = {
        ...dto,
        id: 1,
        senha: hashedPassword,
        data_nascimento: new Date(dto.data_nascimento),
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrisma.usuario.create.mockResolvedValue(usuarioCriado);

      const result = await createUsuario(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.senha, expect.any(Number));
      expect(mockPrisma.usuario.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: dto.email,
          senha: hashedPassword,
        }),
      });
      expect(result).toBeInstanceOf(UsuarioOutputDTO);
    });
  });

  describe('updateUsuario', () => {
    it('deve atualizar os dados do usuário e criptografar a senha se fornecida', async () => {
      const id = 1;
      const dto: UpdateUsuarioInputDTO = {
        primeiro_nome: 'NovoNome',
        senha: 'novaSenha',
        data_nascimento: '1991-02-02',
      };

      const hashed = 'senhaCriptografada';
      const usuarioAtualizado = {
        id,
        email: 'teste@exemplo.com',
        primeiro_nome: dto.primeiro_nome,
        sobrenome: 'Exemplo',
        senha: hashed,
        data_nascimento: new Date(dto.data_nascimento),
        idade: 34,
        status_id: 1,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashed);
      mockPrisma.usuario.update.mockResolvedValue(usuarioAtualizado);

      const result = await updateUsuario(id, dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.senha, expect.any(Number));
      expect(mockPrisma.usuario.update).toHaveBeenCalledWith({
        where: { id },
        data: expect.objectContaining({
          senha: hashed,
          primeiro_nome: dto.primeiro_nome,
        }),
      });
      expect(result).toBeInstanceOf(UsuarioOutputDTO);
    });
  });

  describe('deleteUsuario', () => {
    it('deve excluir um usuário pelo id', async () => {
      const id = 1;

      mockPrisma.usuario.delete.mockResolvedValue({});

      await expect(deleteUsuario(id)).resolves.toBeUndefined();
      expect(mockPrisma.usuario.delete).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
