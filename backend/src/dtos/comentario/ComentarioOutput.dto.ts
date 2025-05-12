import { Expose } from 'class-transformer';

export class ComentarioOutputDto {
  @Expose()
  id: number;

  @Expose()
  conteudo: string;

  @Expose()
  id_tarefa: number;

  @Expose()
  id_usuario: number;

  @Expose()
  criado_em: Date;

  @Expose()
  atualizado_em: Date;
}