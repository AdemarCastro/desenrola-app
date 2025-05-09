import express from 'express';
import { validateDto } from '../middlewares/validation.middleware';
import {
  createComentarioController,
  listComentariosController,
  getComentarioByIdController,
  updateComentarioController,
  deleteComentarioController,
  listComentariosPorTarefaController
} from '../controllers/comentario.controller';

import { CreateComentarioInputDTO } from '../dtos/comentario/CreateComentarioInputDTO';
import { UpdateComentarioInputDTO } from '../dtos/comentario/UpdateComentarioInputDTO';

const router = express.Router();

// Criar um novo comentário
router.post('/comentarios', validateDto(CreateComentarioInputDTO), createComentarioController);

// Listar todos os comentários
router.get('/comentarios', listComentariosController);

// Buscar comentário por ID
router.get('/comentarios/:id', getComentarioByIdController);

// Atualizar comentário
router.put('/comentarios/:id', validateDto(UpdateComentarioInputDTO), updateComentarioController);

// Deletar comentário
router.delete('/comentarios/:id', deleteComentarioController);

// Listar comentários de uma tarefa específica
router.get('/tarefas/:id/comentarios', listComentariosPorTarefaController);

export default router;
