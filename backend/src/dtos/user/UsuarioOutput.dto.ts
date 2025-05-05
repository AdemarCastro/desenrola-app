import { Exclude, Expose } from 'class-transformer';
import { Usuario as PrismaUsuario } from '@prisma/client';

@Exclude()
export class UsuarioOutputDTO {
  @Expose() id: number;
  @Expose() email: string;
  @Expose() primeiro_nome: string;
  @Expose() sobrenome: string;
  @Expose() data_nascimento: Date;
  @Expose() idade?: number;
  @Expose() status: string;
  @Expose() criado_em: Date;
  @Expose() atualizado_em: Date;

  constructor(user: PrismaUsuario) {
    Object.assign(this, user);
  }
}