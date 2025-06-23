import { Expose } from 'class-transformer';

export class TarefaOutputDto {
  @Expose()
  id: number;

  @Expose()
  descricao: string;

  @Expose()
  status_id: number;

  @Expose()
  prioridade_id: number;

  @Expose()
  id_projeto: number;

  @Expose()
  criado_em: Date;

  @Expose()
  data_inicio: Date;

  @Expose()
  data_fim: Date;

  @Expose()
  atualizado_em: Date;
}