import { Router } from 'express';
import { TarefaController } from '../controllers/tarefa.controller';
import { TarefaMiddleware } from '../middleware/tarefa.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', TarefaController.getTarefas);
router.get('/:tarefaId', TarefaMiddleware.validateTarefaExists, TarefaController.getTarefaById);
router.post('/', TarefaMiddleware.validateTarefaCreate, TarefaController.createTarefa);
router.put('/:tarefaId', TarefaMiddleware.validateTarefaExists, TarefaMiddleware.validateTarefaUpdate, TarefaController.updateTarefa);
router.delete('/:tarefaId', TarefaMiddleware.validateTarefaExists, TarefaController.deleteTarefa);

router.get('/:tarefaId/comentarios', authenticateJWT, TarefaMiddleware.validateTarefaExists, TarefaController.getComentariosByTarefa);

export default router;