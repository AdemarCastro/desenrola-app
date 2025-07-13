import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UsuarioOutputDTO {
  @Expose() id: number;
  @Expose() email: string;
  @Expose() primeiro_nome: string;
  @Expose() sobrenome: string;
  @Expose() data_nascimento: Date;
  @Expose() status_id: number;
  @Expose() criado_em: Date;
  @Expose() atualizado_em: Date;
  @Expose() nivel_acesso_id: number;
  @Expose() cargo_id: number;

  constructor(usuario: UsuarioOutputDTO) {
    Object.assign(this, usuario);
  }
}
