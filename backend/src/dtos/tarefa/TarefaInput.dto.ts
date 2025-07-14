import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTarefaInputDto {
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsInt()
  @IsNotEmpty()
  status_id: number;

  @IsInt()
  @IsNotEmpty()
  prioridade_id: number;

  @IsInt()
  @IsNotEmpty()
  id_projeto: number;

  @IsDateString()
  @IsOptional()
  data_inicio?: Date;

  @IsDateString()
  @IsOptional()
  data_fim?: Date;

  @IsInt({ each: true })
  @IsOptional()
  responsaveis_id?: number[];

  @IsInt({ each: true })
  @IsOptional()
  tags_id?: number[];

  @IsInt({ each: true })
  @IsOptional()
  anexos_id?: number[];
}

export class UpdateTarefaInputDto {
  @IsString()
  @IsOptional()
  descricao?: string;

  @IsInt()
  @IsOptional()
  status_id?: number;

  @IsInt()
  @IsOptional()
  prioridade_id?: number;

  @IsDateString()
  @IsOptional()
  data_inicio?: Date;

  @IsDateString()
  @IsOptional()
  data_fim?: Date;

  @IsInt({ each: true })
  @IsOptional()
  responsaveis_id?: number[];

  @IsInt({ each: true })
  @IsOptional()
  tags_id?: number[];

  @IsInt({ each: true })
  @IsOptional()
  anexos_id?: number[];
}