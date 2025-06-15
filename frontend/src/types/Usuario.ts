export type Usuario = {
  id: number;
  email: string;
  primeiro_nome: string;
  sobrenome: string;
  data_nascimento: string;
  nivel_acesso_id: number;  // Campo obrigatório
  status_id: number;        // Campo obrigatório
  projeto?: string;
  tarefas?: number;
  cargo?: string;
};
