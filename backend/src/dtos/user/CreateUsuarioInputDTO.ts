import { IsEmail, IsNotEmpty, Length, IsDateString, IsOptional, IsInt } from 'class-validator';

export class CreateUsuarioInputDTO {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'Primeiro nome é obrigatório' })
  @Length(2, 50)
  primeiro_nome: string;

  @IsNotEmpty({ message: 'Sobrenome é obrigatório' })
  @Length(2, 50)
  sobrenome: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @Length(6, 100)
  senha: string;

  @IsDateString({}, { message: 'Data de nascimento inválida' })
  data_nascimento: string;

  @IsOptional()
  @IsInt({ message: 'Idade deve ser número' })
  idade?: number;
}