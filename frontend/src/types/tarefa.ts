export type Tarefa = {
  id: number;
  descricao: string;
  status_id: number;
  prioridade_id: number;
  criado_em: string;
  concluido_em?: string | null;
  atualizado_em: string;
  apagado_em?: string | null;
};