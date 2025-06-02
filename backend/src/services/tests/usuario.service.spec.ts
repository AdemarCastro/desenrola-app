import { UsuarioService } from '../usuario.service';
import { UsuarioRepository } from '../../repository/usuario.repository';
import bcrypt from 'bcrypt';
import { CreateUsuarioInputDTO } from '../../dtos/usuario/CreateUsuarioInput.dto';
import { UpdateUsuarioInputDTO } from '../../dtos/usuario/UpdateUsuarioInput.dto';

jest.mock('../repository/usuario.repository');
jest.mock('bcrypt');

const mockUsuario = {
  id: 1,
  email: 'test@example.com',
  primeiro_nome: 'John',
  sobrenome: 'Doe',
  senha: 'hashed_password',
  data_nascimento: new Date('1990-01-01'),
  status_id: 1,
  nivel_acesso_id: 2,
};

describe('UsuarioService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários formatados como DTOs', async () => {
      (UsuarioRepository.findAll as jest.Mock).mockResolvedValue([mockUsuario]);

      const result = await UsuarioService.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('email', mockUsuario.email);
      expect(UsuarioRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('deve retornar o usuário encontrado por ID', async () => {
      (UsuarioRepository.findById as jest.Mock).mockResolvedValue(mockUsuario);

      const result = await UsuarioService.findById(1);

      expect(result).toHaveProperty('email', mockUsuario.email);
      expect(UsuarioRepository.findById).toHaveBeenCalledWith(1);
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
      (UsuarioRepository.findById as jest.Mock).mockResolvedValue(null);

      const result = await UsuarioService.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findUsuarioByEmailForAuth', () => {
    it('deve retornar o AuthOutput do usuário', async () => {
      (UsuarioRepository.findByEmailForAuth as jest.Mock).mockResolvedValue(mockUsuario);

      const result = await UsuarioService.findUsuarioByEmailForAuth('test@example.com');

      expect(result).toHaveProperty('email', mockUsuario.email);
    });

    it('deve retornar null se usuário não for encontrado', async () => {
      (UsuarioRepository.findByEmailForAuth as jest.Mock).mockResolvedValue(null);

      const result = await UsuarioService.findUsuarioByEmailForAuth('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('createUsuario', () => {
    it('deve criar um usuário com senha criptografada', async () => {
      const createDto: CreateUsuarioInputDTO = {
        email: 'new@example.com',
        primeiro_nome: 'Jane',
        sobrenome: 'Doe',
        senha: '123456',
        data_nascimento: '2000-01-01',
        status_id: 1,
        nivel_acesso_id: 1,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      (UsuarioRepository.create as jest.Mock).mockResolvedValue({
        ...mockUsuario,
        email: createDto.email,
      });

      const result = await UsuarioService.createUsuario(createDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('123456', expect.any(Number));
      expect(UsuarioRepository.create).toHaveBeenCalled();
      expect(result).toHaveProperty('email', createDto.email);
    });

    it('deve lançar erro se criação falhar', async () => {
      const createDto = {
        email: 'fail@example.com',
        primeiro_nome: 'Fail',
        sobrenome: 'User',
        senha: '123456',
        data_nascimento: '2000-01-01',
        status_id: 1,
        nivel_acesso_id: 1,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      (UsuarioRepository.create as jest.Mock).mockResolvedValue(null);

      await expect(UsuarioService.createUsuario(createDto as any)).rejects.toThrow(
        'Usuário não retornado após a criação no Banco de Dados'
      );
    });
  });

  describe('updateUsuario', () => {
    it('deve atualizar o usuário com nova senha criptografada', async () => {
      const updateDto: UpdateUsuarioInputDTO = {
        senha: 'newpassword',
        primeiro_nome: 'Atualizado',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_password');
      (UsuarioRepository.update as jest.Mock).mockResolvedValue({
        ...mockUsuario,
        primeiro_nome: updateDto.primeiro_nome,
      });

      const result = await UsuarioService.updateUsuario(1, updateDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', expect.any(Number));
      expect(UsuarioRepository.update).toHaveBeenCalledWith(1, {
        ...updateDto,
        senha: 'new_hashed_password',
      });
      expect(result).toHaveProperty('primeiro_nome', updateDto.primeiro_nome);
    });

    it('deve lançar erro se usuário não for retornado', async () => {
      (UsuarioRepository.update as jest.Mock).mockResolvedValue(null);

      await expect(UsuarioService.updateUsuario(1, {})).rejects.toThrow(
        'Usuário não retornado após a atualização no Banco de Dados'
      );
    });
  });

  describe('deleteUsuario', () => {
    it('deve chamar o repositório para deletar o usuário', async () => {
      (UsuarioRepository.delete as jest.Mock).mockResolvedValue(undefined);

      await UsuarioService.deleteUsuario(1);

      expect(UsuarioRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
