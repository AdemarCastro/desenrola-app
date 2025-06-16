import bcrypt from "bcrypt";
import { CreateUsuarioInputDTO } from "../dtos/usuario/CreateUsuarioInput.dto";
import { UpdateUsuarioInputDTO } from "../dtos/usuario/UpdateUsuarioInput.dto";
import { UsuarioOutputDTO } from "../dtos/usuario/UsuarioOutput.dto";
import { UsuarioRepository } from "../repository/usuario.repository";
import { AuthOutput } from "../dtos/auth/AuthOutput.dto";
import { plainToInstance } from "class-transformer";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10", 10);

export class UsuarioService {
  
  static async findAll(): Promise<UsuarioOutputDTO[]> {
    const usuarios = await UsuarioRepository.findAll();
    return plainToInstance(UsuarioOutputDTO, usuarios, {
      excludeExtraneousValues: true,
    });
  }

  static async findById(id: number): Promise<UsuarioOutputDTO | null> {
    const usuario = await UsuarioRepository.findById(id);
    if (!usuario) return null;
    return plainToInstance(UsuarioOutputDTO, usuario, {
      excludeExtraneousValues: true,
    });
  }

  static async findUsuarioByEmailForAuth(email: string): Promise<AuthOutput | null> {
    const usuario = await UsuarioRepository.findByEmailForAuth(email);
    if (!usuario) return null;
    return plainToInstance(AuthOutput, usuario, {
      excludeExtraneousValues: true,
    });
  }

  static async createUsuario(data: CreateUsuarioInputDTO): Promise<UsuarioOutputDTO> {
    const hashed = await bcrypt.hash(data.senha, SALT_ROUNDS);
    const usuario = await UsuarioRepository.create({
      ...data,
      senha: hashed,
      data_nascimento: new Date(data.data_nascimento),
    });
    if (!usuario) throw new Error("Usuário não retornado após a criação no Banco de Dados");
    return plainToInstance(UsuarioOutputDTO, usuario, {
      excludeExtraneousValues: true,
    });
  }

  static async updateUsuario(id: number, data: UpdateUsuarioInputDTO): Promise<UsuarioOutputDTO> {
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, SALT_ROUNDS);
    }
    const usuario = await UsuarioRepository.update(id, data);
    if (!usuario) throw new Error("Usuário não retornado após a atualização no Banco de Dados");
    return plainToInstance(UsuarioOutputDTO, usuario, {
      excludeExtraneousValues: true,
    });
  }

  static async deleteUsuario(id: number): Promise<void> {
    await UsuarioRepository.delete(id);
  }
}
