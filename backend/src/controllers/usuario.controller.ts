import { Request, Response } from "express";
import { UsuarioService } from "../services/usuario.service";
import { UpdateUsuarioInputDTO } from "../dtos/usuario/UpdateUsuarioInput.dto";

export class UsuarioController {
  static async getUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await UsuarioService.findAll();
      res.json(usuarios);
    } catch {
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  }

  static async getUsuarioById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.usuarioId, 10);
      const usuario = await UsuarioService.findById(id);

      if (!usuario) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
      }

      res.json(usuario);
    } catch {
      res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  }

  static async createUsuario(req: Request, res: Response): Promise<void> {
    try {
      const dto = await UsuarioService.createUsuario(req.body);
      res.status(201).json(dto);
    } catch {
      res.status(500).json({ message: "Erro ao criar usuário" });
    }
  }

  static async updateUsuario(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.usuarioId, 10);
      const dto = await UsuarioService.updateUsuario(id, req.body as UpdateUsuarioInputDTO);
      res.json(dto);
    } catch {
      res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  }

  static async deleteUsuario(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.usuarioId, 10);
      await UsuarioService.deleteUsuario(id);
      res.status(204).send();
    } catch {
      res.status(500).json({ message: "Erro ao deletar usuário" });
    }
  }
}
