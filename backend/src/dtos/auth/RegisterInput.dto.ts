import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterInputDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  senha: string;

  @IsString({ message: 'Primeiro nome deve ser uma string' })
  primeiro_nome: string;

  @IsString({ message: 'Sobrenome deve ser uma string' })
  sobrenome: string;

  @IsString({ message: 'Data de nascimento deve ser uma string' })
  data_nascimento: string;
}