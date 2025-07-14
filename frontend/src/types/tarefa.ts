export interface Anexo {
  id: number;
  url: string;
  nome_arquivo: string;
  tipo_arquivo: 'image' | 'document' | 'video' | 'audio' | 'link';
}

export interface Responsavel {
  id: number;
  primeiro_nome: string;
  sobrenome: string;
  avatar_url?: string;
}

export type Tarefa = {
  id: number;
  id_projeto: number;
  descricao: string;
  status_id: number;
  prioridade_id: number;
  criado_em: string;
  data_inicio?: string | null;
  data_fim?: string | null;
  concluido_em?: string | null;
  atualizado_em: string;
  apagado_em?: string | null;
  responsaveis?: Responsavel[];
  anexos?: Anexo[];
};