import { Exclude, Expose } from "class-transformer";

@Exclude()
export class AuthOutput {
  @Expose() id: number;
  @Expose() email: string;
  @Expose() senha: string;
  @Expose() nivel_acesso_id: number | null;

  constructor(usuario: AuthOutput) {
    Object.assign(this, usuario);
  }
}