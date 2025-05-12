import {
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  Length,
} from "class-validator";

export class UpdateUsuarioInputDTO {
  @IsEmail({}, { message: "E-mail inválido" })
  @IsOptional()
  email?: string;

  @Length(2, 50, { message: "Primeiro nome deve ter entre 2 e 50 caracteres" })
  @IsOptional()
  primeiro_nome?: string;

  @Length(2, 50, { message: "Sobrenome deve ter entre 2 e 50 caracteres" })
  @IsOptional()
  sobrenome?: string;

  @Length(6, 20, { message: "Senha deve ter entre 6 e 20 caracteres" })
  @IsOptional()
  senha?: string;

  @IsDateString({}, { message: "Data de nascimento inválida" })
  @IsOptional()
  data_nascimento?: string | Date;

  @IsInt({ message: "Status inválido" })
  @IsOptional()
  status_id?: number;

  // ⚠️ Remover futuramente
  @IsInt()
  @IsOptional()
  idade?: number;
}
