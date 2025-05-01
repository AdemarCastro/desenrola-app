import { Request, Response } from 'express';
import { createUser, getAllUsers } from '../services/user.service';

export async function createUserController(req: Request, res: Response) {
  try {
    const dto = await createUser(req.body);
    res.status(201).json(dto);
  } catch {
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
}

export async function listUsersController(_req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
}