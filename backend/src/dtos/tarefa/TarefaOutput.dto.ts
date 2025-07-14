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

  @Expose()
  concluido_em: Date;

  @Expose()
  apagado_em: Date;

  @Expose()
  responsaveis: {
    id: number;
    primeiro_nome: string;
    sobrenome: string;
    avatar_url?: string;
  }[];

  @Expose()
  anexos: {
    id: number;
    url: string;
    nome_arquivo: string;
    tipo_arquivo: 'image' | 'document' | 'video' | 'audio' | 'link';
  }[];

  @Expose()
  comentarios: {
    id: number;
    conteudo: string;
    criado_em: Date;
    usuario: {
      id: number;
      primeiro_nome: string;
      sobrenome: string;
      email: string;
    };
  }[];

  @Expose()
  tags: {
    id: number;
    nome: string;
    cor: string;
  }[];
}