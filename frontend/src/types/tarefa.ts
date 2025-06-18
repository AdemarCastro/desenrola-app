export type Tarefa = {
  id: number;
  descricao: string;
  status_id: number;
  prioridade_id: number;
  id_projeto: number;            // <-- adicionado
  criado_em: string;
  atualizado_em: string;
  apagado_em?: string | null;
};