import { Request, Response } from "express";
import {
  createUsuario,
  getAllUsuarios,
  deleteUsuario,
  updateUsuario,
} from "../services/usuario.service";
import { UpdateUsuarioInputDTO } from "../dtos/usuario/UpdateUsuarioInput.dto";

export async function createUsuarioController(req: Request, res: Response) {
  try {
    const dto = await createUsuario(req.body);
    res.status(201).json(dto);
  } catch {
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
}

export async function getUsuariosController(req: Request, res: Response) {
  try {
    const usuarios = await getAllUsuarios();
    res.json(usuarios);
  } catch {
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
}

export async function updateUsuarioController(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const dto = await updateUsuario(id, req.body as UpdateUsuarioInputDTO);
    res.json(dto);
  } catch {
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
}

export async function deleteUsuarioController(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    await deleteUsuario(id);
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Erro ao deletar usuário" });
  }
}
