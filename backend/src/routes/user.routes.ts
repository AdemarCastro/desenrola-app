import express from 'express';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateUserInputDTO } from '../dtos/user/CreateUserInput.dto';
import { createUserController, listUsersController } from '../controllers/user.controller';

const router = express.Router();
router.post('/users', validateDto(CreateUserInputDTO), createUserController);
router.get('/users', listUsersController);

export default router;