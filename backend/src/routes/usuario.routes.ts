import { Router } from "express";
import {
  getUsuariosController,
  createUsuarioController,
  updateUsuarioController,
  deleteUsuarioController,
} from "../controllers/usuario.controller";

import { validateDto } from "../middleware/validation.middleware";
import { authenticateJWT } from "../middleware/auth.middleware";
import { CreateUsuarioInputDTO } from "../dtos/usuario/CreateUsuarioInput.dto";
import { UpdateUsuarioInputDTO } from "../dtos/usuario/UpdateUsuarioInput.dto";

const router = Router();


router.use(authenticateJWT);
router.post("/", validateDto(CreateUsuarioInputDTO), createUsuarioController);
router.get("/", getUsuariosController);
router.put("/:id", validateDto(UpdateUsuarioInputDTO), updateUsuarioController);
router.delete("/:id", deleteUsuarioController);

export default router;
