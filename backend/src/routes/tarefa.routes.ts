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

router.get('/', authenticateJWT, getTarefas);
router.get('/:tarefaId', authenticateJWT, validateTarefaExists, getTarefaById);
router.post('/', authenticateJWT, validateDto(CreateTarefaInputDto), createTarefa);
router.put('/:tarefaId', authenticateJWT, validateTarefaExists, validateDto(UpdateTarefaInputDto), updateTarefa);
router.delete('/:tarefaId', authenticateJWT, validateTarefaExists, deleteTarefa);

router.get('/:tarefaId/comentarios', authenticateJWT, validateTarefaExists, getComentariosByTarefa);

export default router;