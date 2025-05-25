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

const router = Router();

router.get('/', getTarefas);
router.get('/:tarefaId', validateTarefaExists, getTarefaById);
router.post('/', validateDto(CreateTarefaInputDto), createTarefa);
router.put('/:tarefaId', validateTarefaExists, validateDto(UpdateTarefaInputDto), updateTarefa);
router.delete('/:tarefaId', validateTarefaExists, deleteTarefa);
router.get('/:tarefaId/comentarios', validateTarefaExists, getComentariosByTarefa);

export default router;