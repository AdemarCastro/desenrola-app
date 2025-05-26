import { Router } from 'express';
import {
  getTarefas,
  getTarefaById,
  createTarefa,
  updateTarefa,
  deleteTarefa,
  getComentariosByTarefa,
} from '../controllers/tarefa.controller';
import { validateDto } from '../middleware/validation.middleware';
import { CreateTarefaInputDto } from '../dtos/tarefa/TarefaInput.dto';
import { UpdateTarefaInputDto } from '../dtos/tarefa/TarefaInput.dto';
import { validateTarefaExists } from '../middleware/tarefa.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Listar tarefas (requer autenticação)
router.get('/', authenticateJWT, getTarefas);
// Detalhar tarefa (requer autenticação)
router.get('/:tarefaId', authenticateJWT, validateTarefaExists, getTarefaById);
// Criar tarefa (requer autenticação)
router.post('/', authenticateJWT, validateDto(CreateTarefaInputDto), createTarefa);
// Atualizar tarefa (requer autenticação)
router.put('/:tarefaId', authenticateJWT, validateTarefaExists, validateDto(UpdateTarefaInputDto), updateTarefa);
// Deletar tarefa (requer autenticação)
router.delete('/:tarefaId', authenticateJWT, validateTarefaExists, deleteTarefa);
// Listar comentários de tarefa (requer autenticação)
router.get('/:tarefaId/comentarios', authenticateJWT, validateTarefaExists, getComentariosByTarefa);

export default router;