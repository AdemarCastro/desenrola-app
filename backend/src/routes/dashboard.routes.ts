import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { validateProjetoExists } from '../middleware/projeto.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/:projetoId', validateProjetoExists, DashboardController.getDashboardData);

export default router;