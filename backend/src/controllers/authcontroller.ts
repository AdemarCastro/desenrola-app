import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../client';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findFirst({
      where: { email, apagado_em: null },
      select: { id: true, email: true, senha: true, nivel_acesso_id: true },
    });
    if (!usuario) {
      res.status(401).json({ error: 'Email ou senha incorretos' });
      return;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      res.status(401).json({ error: 'Email ou senha incorretos' });
      return;
    }

    const payload = {
      userId: usuario.id,
      email: usuario.email,
      nivelAcessoId: usuario.nivel_acesso_id,
    };

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

    res.json({ token });
  }
}