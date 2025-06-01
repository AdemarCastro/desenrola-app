import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  createUsuario,
  findUsuarioByEmailForAuth,
} from './usuario.service';
import { CreateUsuarioInputDTO } from '../dtos/usuario/CreateUsuarioInput.dto';
import { LoginInputDto } from '../dtos/auth/LoginInput.dto';
import { RegisterInputDto } from '../dtos/auth/RegisterInput.dto';

export class AuthService {
  public async login(
    loginData: LoginInputDto
  ): Promise<{ token: string }> {
    const { email, senha } = loginData;

    const usuario = await findUsuarioByEmailForAuth(email);

    if (!usuario) {
      throw new Error('Email ou senha incorretos');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('Email ou senha incorretos');
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

    return { token };
  }

  public async register(
    registerData: RegisterInputDto
  ): Promise<{ id: number; email: string }> {
    const {
      email,
      senha,
      primeiro_nome,
      sobrenome,
      data_nascimento,
    } = registerData;

    const usuarioExistente = await findUsuarioByEmailForAuth(email);
    if (usuarioExistente) {
      throw new Error('Email já cadastrado');
    }

    const createUsuarioDto: CreateUsuarioInputDTO = {
      email,
      senha,
      primeiro_nome,
      sobrenome,
      data_nascimento,
      status_id: 1,
      nivel_acesso_id: 3,
    };

    const novoUsuario = await createUsuario(createUsuarioDto);

    return { id: novoUsuario.id, email: novoUsuario.email };
  }
}