import { Request, Response } from 'express';
import { createUsuario, getAllUsuarios } from '../services/usuario.service';

export async function createUsuarioController(req: Request, res: Response) {
  try {
    const dto = await createUsuario(req.body);
    res.status(201).json(dto);
  } catch {
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
}

export async function listUsuariosController(_req: Request, res: Response) {
  try {
    const usuarios = await getAllUsuarios();
    res.json(usuarios);
  } catch {
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
}