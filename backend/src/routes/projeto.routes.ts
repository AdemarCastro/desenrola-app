import { Router } from 'express';
import { ProjetoController } from '../controllers/projeto.controller';
import {
  validateProjetoCreate,
  validateProjetoUpdate,
  validateProjetoExists,
} from '../middleware/projeto.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', ProjetoController.getProjetos);
router.get('/:projetoId', validateProjetoExists, ProjetoController.getProjetoById);
router.post('/', validateProjetoCreate, ProjetoController.createProjeto);
router.put('/:projetoId', validateProjetoExists, validateProjetoUpdate, ProjetoController.updateProjeto);
router.delete('/:projetoId', validateProjetoExists, ProjetoController.deleteProjeto);

router.get('/:projetoId/usuarios', validateProjetoExists, ProjetoController.getProjetoUsuarios);
router.post('/:projetoId/usuarios', validateProjetoExists, ProjetoController.addProjetoUsuario);
router.put('/:projetoId/usuarios/:usuarioId', validateProjetoExists, ProjetoController.updateProjetoUsuario);
router.delete('/:projetoId/usuarios/:usuarioId', validateProjetoExists, ProjetoController.deleteProjetoUsuario);

router.get('/:projetoId/tarefas', validateProjetoExists, ProjetoController.getProjetoTarefas);

export default router;