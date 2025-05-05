import express from 'express';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateUsuarioInputDTO } from '../dtos/user/CreateUsuarioInputDTO';
import { createUsuarioController, listUsuariosController } from '../controllers/usuario.controller';

const router = express.Router();
router.post('/usuarios', validateDto(CreateUsuarioInputDTO), createUsuarioController);
router.get('/usuarios', listUsuariosController);

export default router;