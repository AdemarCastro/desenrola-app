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

  @IsNotEmpty({ message: "Data de nascimento é obrigatória" })
  @IsDateString({}, { message: "Data de nascimento deve estar no formato ISO-8601" })
  data_nascimento: string | Date;

  @IsInt({ message: "Status inválido" })
  status_id: number;

  @IsInt({ message: "Nível de acesso inválido" })
  nivel_acesso_id: number;

  @IsNotEmpty({ message: 'O ID do cargo não pode ser vazio.' })
  @IsInt({ message: 'O ID do cargo deve ser um número inteiro.' })
  cargo_id: number;
}
