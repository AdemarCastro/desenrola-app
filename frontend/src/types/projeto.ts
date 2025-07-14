// frontend/src/types/projeto.ts
export type UsuarioProjeto = {
  id: number;
  primeiro_nome: string;
  sobrenome: string;
  avatar_url: string;
  nivel_acesso_id: number;
};

export type Projeto = {
  id: number;
  nome: string;
  progresso: number;
  descricao?: string;
  data_entrega?: string;
  criado_em: string;
  atualizado_em: string;
  apagado_em?: string | null;

  // Novo campo adicionado
  usuariosOrdenados?: UsuarioProjeto[];
};
