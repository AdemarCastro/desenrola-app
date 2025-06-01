import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { UsuarioMiddleware } from "../middleware/usuario.middleware";

const router = Router();

router.use(authenticateJWT);

router.get("/", UsuarioController.getUsuarios);
router.get("/:usuarioId", UsuarioMiddleware.validateUsuarioExists, UsuarioController.getUsuarioById);
router.post("/", UsuarioMiddleware.validateUsuarioCreate, UsuarioController.createUsuario);
router.put("/:usuarioId", UsuarioMiddleware.validateUsuarioExists, UsuarioMiddleware.validateUsuarioUpdate, UsuarioController.updateUsuario);
router.delete("/:usuarioId", UsuarioMiddleware.validateUsuarioExists, UsuarioController.deleteUsuario);

export default router;