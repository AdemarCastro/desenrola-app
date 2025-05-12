import { Router } from 'express';
import {
  getTarefas,
  getTarefaById,
  createTarefa,
  updateTarefa,
  deleteTarefa,
  getComentariosByTarefa,
} from '../controllers/tarefa.controller';

const router = Router();

router.get('/', getTarefas);
router.get('/:tarefaId', getTarefaById);
router.post('/', createTarefa);
router.put('/:tarefaId', updateTarefa);
router.delete('/:tarefaId', deleteTarefa);
router.get('/:tarefaId/comentarios', getComentariosByTarefa);

export default router;