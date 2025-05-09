import express from 'express';
import { validateDto } from '../middlewares/validation.middleware';
import {
  createTarefaController,
  listTarefasController,
  getTarefaByIdController,
  updateTarefaController,
  deleteTarefaController,
  listTarefasPorProjetoController
} from '../controllers/tarefa.controller';

import { CreateTarefaInputDTO } from '../dtos/tarefa/CreateTarefaInputDTO';
import { UpdateTarefaInputDTO } from '../dtos/tarefa/UpdateTarefaInputDTO';

const router = express.Router();

// Criar uma nova tarefa
router.post('/tarefas', validateDto(CreateTarefaInputDTO), createTarefaController);

// Listar todas as tarefas
router.get('/tarefas', listTarefasController);

// Buscar tarefa por ID
router.get('/tarefas/:id', getTarefaByIdController);

// Atualizar uma tarefa
router.put('/tarefas/:id', validateDto(UpdateTarefaInputDTO), updateTarefaController);

// Deletar uma tarefa
router.delete('/tarefas/:id', deleteTarefaController);

// Listar tarefas de um projeto específico
router.get('/projetos/:id/tarefas', listTarefasPorProjetoController);

export default router;
