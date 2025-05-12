import { Expose, Transform } from 'class-transformer';

export class ProjetoOutputDto {
  @Expose()
  id: number;

  @Expose()
  nome: string;

  @Expose()
  descricao?: string | null;

  @Expose()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  data_entrega?: Date | null;

  @Expose()
  criado_em: Date;

  @Expose()
  atualizado_em: Date;
}
