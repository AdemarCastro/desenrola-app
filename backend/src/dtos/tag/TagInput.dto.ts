import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTagInputDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
}

export class UpdateTagInputDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
}