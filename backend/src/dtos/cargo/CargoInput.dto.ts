import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCargoInputDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
}

export class UpdateCargoInputDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
}