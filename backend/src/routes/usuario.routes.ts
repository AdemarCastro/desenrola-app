import express from 'express';
import { validateDto } from '../middlewares/validation.middleware';
import {
  createUsuarioController,
  listUsuariosController,
  getUsuarioByIdController,
  updateUsuarioController,
  deleteUsuarioController,
  loginUsuarioController,
  logoutUsuarioController,
  promoverUsuarioController
} from '../controllers/usuario.controller';

import { CreateUsuarioInputDTO } from '../dtos/user/CreateUsuarioInputDTO';
import { UpdateUsuarioInputDTO } from '../dtos/user/UpdateUsuarioInputDTO';
import { LoginUsuarioDTO } from '../dtos/user/LoginUsuarioDTO';
import { PromoverUsuarioDTO } from '../dtos/user/PromoverUsuarioDTO';

const router = express.Router();

// Criar usuário
router.post('/usuarios', validateDto(CreateUsuarioInputDTO), createUsuarioController);

// Listar todos os usuários
router.get('/usuarios', listUsuariosController);

// Buscar usuário por ID
router.get('/usuarios/:id', getUsuarioByIdController);

// Atualizar usuário
router.put('/usuarios/:id', validateDto(UpdateUsuarioInputDTO), updateUsuarioController);

// Deletar/arquivar usuário
router.delete('/usuarios/:id', deleteUsuarioController);

// Login
router.post('/usuarios/login', validateDto(LoginUsuarioDTO), loginUsuarioController);

// Logout
router.post('/usuarios/:id/logout', logoutUsuarioController);

// Promover usuário (para admin, proprietário, membro)
router.post('/usuarios/:id/promover', validateDto(PromoverUsuarioDTO), promoverUsuarioController);

export default router;
