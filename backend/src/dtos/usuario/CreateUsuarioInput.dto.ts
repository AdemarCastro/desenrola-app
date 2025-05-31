import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  Length,
} from "class-validator";

export class CreateUsuarioInputDTO {
  @IsEmail({}, { message: "E-mail inválido" })
  email: string;

  @IsNotEmpty({ message: "Primeiro nome é obrigatório" })
  @Length(2, 50)
  primeiro_nome: string;

  @IsNotEmpty({ message: "Sobrenome é obrigatório" })
  @Length(2, 50)
  sobrenome: string;

  @IsNotEmpty({ message: "Senha é obrigatória" })
  @Length(6, 20)
  senha: string;

  @IsDateString({}, { message: "Data de nascimento inválida" })
  data_nascimento: string;

  @IsInt({ message: "Status inválido" })
  status_id: number;

  // ⚠️ Remover em versões futuras
  //@IsInt()
  //idade: number;
}
