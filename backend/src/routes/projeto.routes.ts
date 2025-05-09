import express from 'express';
import { validateDto } from '../middlewares/validation.middleware';
import {
  createProjetoController,
  listProjetosController,
  getProjetoByIdController,
  updateProjetoController,
  deleteProjetoController,
  listarProjetosDoUsuarioController
} from '../controllers/projeto.controller';

import { CreateProjetoInputDTO } from '../dtos/projeto/CreateProjetoInputDTO';
import { UpdateProjetoInputDTO } from '../dtos/projeto/UpdateProjetoInputDTO';

const router = express.Router();

// Criar um novo projeto
router.post('/projetos', validateDto(CreateProjetoInputDTO), createProjetoController);

// Listar todos os projetos
router.get('/projetos', listProjetosController);

// Buscar projeto por ID
router.get('/projetos/:id', getProjetoByIdController);

// Atualizar um projeto
router.put('/projetos/:id', validateDto(UpdateProjetoInputDTO), updateProjetoController);

// Deletar (ou arquivar) um projeto
router.delete('/projetos/:id', deleteProjetoController);

// Listar projetos de um usuário específico (como proprietário ou membro)
router.get('/usuarios/:id/projetos', listarProjetosDoUsuarioController);

export default router;
