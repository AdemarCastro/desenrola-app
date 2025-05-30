import { Router } from 'express';
import { AuthController } from '../controllers/authcontroller';
import { validateDto } from '../middleware/validation.middleware';
import { LoginInputDto } from '../dtos/auth/LoginInput.dto';
import { RegisterInputDto } from '../dtos/auth/RegisterInput.dto';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.post(
  '/login',
  validateDto(LoginInputDto),
  async (req, res, next) => {
    try {
      await AuthController.login(req, res);
      next();
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/register',
  validateDto(RegisterInputDto),
  async (req, res, next) => {
    try {
      await AuthController.register(req, res);
      next();
    } catch (error) {
      next(error);
    }
  }
);


router.post(
  '/logout',
  authenticateJWT,
  async (req, res, next) => {
    try {
      await AuthController.logout(req, res);
      next();
    } catch (error) {
      next(error);
    }
  }
);

export default router;