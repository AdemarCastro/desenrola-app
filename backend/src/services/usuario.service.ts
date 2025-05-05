import bcrypt from 'bcrypt';
import { CreateUsuarioInputDTO } from '../dtos/user/CreateUsuarioInputDTO';
import { UsuarioOutputDTO } from '../dtos/user/UsuarioOutput.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

export async function createUsuario(data: CreateUsuarioInputDTO): Promise<UsuarioOutputDTO> {
  const hash = await bcrypt.hash(data.senha, SALT_ROUNDS);
  const u = await prisma.usuario.create({
    data: {
      email: data.email,
      primeiro_nome: data.primeiro_nome,
      sobrenome: data.sobrenome,
      senha: hash,
      data_nascimento: new Date(data.data_nascimento),
      idade: data.idade,
    }
  });
  return new UsuarioOutputDTO(u);
}

export async function getAllUsuarios(): Promise<UsuarioOutputDTO[]> {
  const list = await prisma.usuario.findMany();
  return list.map(u => new UsuarioOutputDTO(u));
}