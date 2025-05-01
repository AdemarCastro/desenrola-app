import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserInputDTO {
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @Length(2, 50, { message: 'Nome deve ter entre 2 e 50 caracteres' })
    name: string;

    @IsEmail({}, { message: 'E-mail inválido' })
    email: string;

    @IsNotEmpty({ message: 'Senha é obrigatória' })
    @Length(6, 20, { message: 'Senha deve ter entre 6 e 20 caracteres' })
    password: string;
}