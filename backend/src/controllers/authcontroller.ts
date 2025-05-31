import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../client';

export class AuthController {
  /**
   * POST /api/auth/login
   * body: { email: string; senha: string }
   */
  static async login(req: Request, res: Response): Promise<void> {
    const { email, senha } = req.body;

    // 1. Buscar usuário ativo pelo e-mail
    const usuario = await prisma.usuario.findFirst({
      where: { email, apagado_em: null },
      select: { id: true, email: true, senha: true, nivel_acesso_id: true },
    });
    if (!usuario) {
      res.status(401).json({ error: 'Email ou senha incorretos' });
      return;
    }

    // 2. Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      res.status(401).json({ error: 'Email ou senha incorretos' });
      return;
    }

    // 3. Gerar JWT
    const payload = {
      userId: usuario.id,
      email: usuario.email,
      nivelAcessoId: usuario.nivel_acesso_id,
    };

    // Simplifica expiresIn para string
    const expiresIn: string = process.env.JWT_EXPIRES_IN || '1h';

    const jwtOptions: SignOptions = {
      algorithm: 'HS256',
      expiresIn,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      jwtOptions
    );

    // 4. Responder com o token
    res.json({ token });
  }

  /**
   * POST /api/auth/logout
   */
  static async logout(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    console.log(`Usuário ${userId} deslogou em ${new Date().toISOString()}`);
    res.status(204).send();
  }
}