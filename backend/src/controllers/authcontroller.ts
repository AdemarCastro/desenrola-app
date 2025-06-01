import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha } = req.body;
      const { token } = await authService.login({ email, senha });
      res.json({ token });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(401).json({ error: 'Email ou senha incorretos', message });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha, primeiro_nome, sobrenome, data_nascimento } = req.body;
      const { id, email: userEmail } = await authService.register({
        email,
        senha,
        primeiro_nome,
        sobrenome,
        data_nascimento,
      });
      res.status(201).json({ id, email: userEmail });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: 'Erro ao registrar usuário', message });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    res.status(200).json({ message: 'Logout successful' });
  }
}