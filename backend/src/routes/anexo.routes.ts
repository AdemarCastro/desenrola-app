import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { TarefaController } from '../controllers/tarefa.controller';

const router = Router();

router.use(authenticateJWT);

router.delete('/:anexoId', TarefaController.deleteAnexo);

export default router;