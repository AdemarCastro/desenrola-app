import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateComentarioInputDto {
  @IsString()
  @IsNotEmpty()
  conteudo: string;

  @IsInt()
  @IsNotEmpty()
  id_tarefa: number;

  @IsInt()
  @IsNotEmpty()
  id_usuario: number;
}

export class UpdateComentarioInputDto {
  @IsString()
  @IsNotEmpty()
  conteudo: string;
}