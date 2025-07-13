import { Router } from 'express';
import { TarefaController } from '../controllers/tarefa.controller';
import { TarefaMiddleware } from '../middleware/tarefa.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateJWT);

router.get('/', TarefaController.getTarefas);
router.post('/', TarefaMiddleware.validateTarefaCreate, TarefaController.createTarefa);
router.get('/:tarefaId', TarefaMiddleware.validateTarefaExists, TarefaController.getTarefaById);
router.put('/:tarefaId', TarefaMiddleware.validateTarefaExists, TarefaMiddleware.validateTarefaUpdate, TarefaController.updateTarefa);
router.delete('/:tarefaId', TarefaMiddleware.validateTarefaExists, TarefaController.deleteTarefa);

// Comentários
router.get('/:tarefaId/comentarios', TarefaMiddleware.validateTarefaExists, TarefaController.getComentariosByTarefa);

// Anexos
router.get('/:tarefaId/anexos', TarefaMiddleware.validateTarefaExists, TarefaController.getAnexos);
router.post('/:tarefaId/anexos', TarefaMiddleware.validateTarefaExists, TarefaController.createAnexo);

// Responsáveis
router.get('/:tarefaId/responsaveis', TarefaMiddleware.validateTarefaExists, TarefaController.getResponsaveis);
router.post('/:tarefaId/responsaveis', TarefaMiddleware.validateTarefaExists, TarefaController.addResponsaveis);
router.delete('/:tarefaId/responsaveis', TarefaMiddleware.validateTarefaExists, TarefaController.removerResponsavel);

export default router;