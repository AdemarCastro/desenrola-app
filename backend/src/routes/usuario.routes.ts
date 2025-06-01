import { Router } from "express";
import {
  getUsuariosController,
  createUsuarioController,
  updateUsuarioController,
  deleteUsuarioController,
} from "../controllers/usuario.controller";

import { validateDto } from "../middleware/validation.middleware";
import { CreateUsuarioInputDTO } from "../dtos/usuario/CreateUsuarioInput.dto";
import { UpdateUsuarioInputDTO } from "../dtos/usuario/UpdateUsuarioInput.dto";

const router = Router();

router.get("/", getUsuariosController);
router.get("/:usuarioId", getUsuariosController);
router.post("/", validateDto(CreateUsuarioInputDTO), createUsuarioController);
router.put("/:usuarioId", validateDto(UpdateUsuarioInputDTO), updateUsuarioController);
router.delete("/:usuarioId", deleteUsuarioController);

export default router;
