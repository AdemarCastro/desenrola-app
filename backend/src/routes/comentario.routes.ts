import { Router } from 'express';
import { ComentarioController } from '../controllers/comentario.controller';
import {
  validateComentarioCreate,
  validateComentarioUpdate,
  validateComentarioExists,
} from '../middleware/comentario.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const controller = new ComentarioController();

router.use(authenticateJWT);

router.get('/', controller.getComentarios);
router.get('/:comentarioId', validateComentarioExists, controller.getComentarioById);
router.post('/', validateComentarioCreate, controller.createComentario);
router.put('/:comentarioId', validateComentarioExists, validateComentarioUpdate, controller.updateComentario);
router.delete('/:comentarioId', validateComentarioExists, controller.deleteComentario);

export default router;