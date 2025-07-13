import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { CargoController } from '../controllers/cargo.controller';
import { validateCargoCreate, validateCargoUpdate, validateCargoExists } from '../middleware/cargo.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', CargoController.getCargos);
router.post('/', validateCargoCreate, CargoController.createCargo);
router.get('/:id', validateCargoExists, CargoController.getCargoById);
router.put('/:id', validateCargoExists, validateCargoUpdate, CargoController.updateCargo);
router.delete('/:id', validateCargoExists, CargoController.deleteCargo);

export default router;