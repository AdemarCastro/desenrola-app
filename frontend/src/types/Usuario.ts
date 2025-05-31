export type Usuario = {
  id: number;
  email: string;
  primeiro_nome: string;
  sobrenome: string;
  data_nascimento: string;
  status_id: number;
  projeto?: string;
  tarefas?: number;
  cargo?: string;
};
