import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { CreateUsuarioInputDTO } from "../dtos/usuario/CreateUsuarioInput.dto";
import { UpdateUsuarioInputDTO } from "../dtos/usuario/UpdateUsuarioInput.dto";
import { UsuarioOutputDTO } from "../dtos/usuario/UsuarioOutput.dto";

const prisma = new PrismaClient();
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10", 10);

export async function createUsuario(
  data: CreateUsuarioInputDTO
): Promise<UsuarioOutputDTO> {
  const hashed = await bcrypt.hash(data.senha, SALT_ROUNDS);
  const usuario = await prisma.usuario.create({
    data: {
      email: data.email,
      primeiro_nome: data.primeiro_nome,
      sobrenome: data.sobrenome,
      senha: hashed,
      data_nascimento: new Date(data.data_nascimento),
      idade: data.idade, // ⚠️ Remover futuramente
      status_id: data.status_id,
    },
  });
  return new UsuarioOutputDTO(usuario);
}

export async function getAllUsuarios(): Promise<UsuarioOutputDTO[]> {
  const usuarios = await prisma.usuario.findMany();
  return usuarios.map((u) => new UsuarioOutputDTO(u));
}

export async function updateUsuario(
  id: number,
  data: UpdateUsuarioInputDTO
): Promise<UsuarioOutputDTO> {
  const updateData = { ...data };

  if (updateData.senha) {
    updateData.senha = await bcrypt.hash(updateData.senha, SALT_ROUNDS);
  }

  if (updateData.data_nascimento) {
    updateData.data_nascimento = new Date(updateData.data_nascimento);
  }

  const usuario = await prisma.usuario.update({
    where: { id },
    data: updateData,
  });

  return new UsuarioOutputDTO(usuario);
}

export async function deleteUsuario(id: number): Promise<void> {
  await prisma.usuario.delete({ where: { id } });
}
