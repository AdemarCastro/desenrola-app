export type UsuarioProjeto = {
  id: number;
  primeiro_nome: string;
  sobrenome: string;
  avatar_url: string;
  nivel_acesso_id: number;
};

export type UsuarioComNivel = {
  usuario_id: number;
  nivel_acesso_id: number;
  usuario: {
    id: number;
    primeiro_nome: string;
    sobrenome: string;
    avatar_url?: string;
  };
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

  usuariosOrdenados?: UsuarioProjeto[];
};
