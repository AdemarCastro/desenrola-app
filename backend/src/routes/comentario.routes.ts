import { Router } from 'express';
import { ComentarioController } from '../controllers/comentario.controller';
import { ComentarioMiddleware } from '../middleware/comentario.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', ComentarioController.getComentarios);
router.get('/:comentarioId', ComentarioMiddleware.validateComentarioExists, ComentarioController.getComentarioById);
router.post('/', ComentarioMiddleware.validateComentarioCreate, ComentarioController.createComentario);
router.put('/:comentarioId', ComentarioMiddleware.validateComentarioExists, ComentarioMiddleware.validateComentarioUpdate, ComentarioController.updateComentario);
router.delete('/:comentarioId', ComentarioMiddleware.validateComentarioExists, ComentarioController.deleteComentario);

export default router;