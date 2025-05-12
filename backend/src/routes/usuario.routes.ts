import express from "express";
import { validateDto } from "../middlewares/validation.middleware";
import { CreateUsuarioInputDTO } from "../dtos/CreateUsuarioInput.dto";
import { UpdateUsuarioInputDTO } from "../dtos/UpdateUsuarioInput.dto";
import {
  createUsuarioController,
  deleteUsuarioController,
  updateUsuarioController
} from "../controllers/usuario.controller";

const router = express.Router();

router.post(
  "/usuarios",
  validateDto(CreateUsuarioInputDTO),
  createUsuarioController
);
router.put(
  "/usuarios/:id",
  validateDto(UpdateUsuarioInputDTO),
  updateUsuarioController
);
router.delete("/usuarios/:id", deleteUsuarioController);

export default router;
