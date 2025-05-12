import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateProjetoInputDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsDateString()
  @IsOptional()
  data_entrega?: string;
}

export class UpdateProjetoInputDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsDateString()
  @IsOptional()
  data_entrega?: string;
}