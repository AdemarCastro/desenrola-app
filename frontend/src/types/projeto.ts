export type Projeto = {
  id: number;
  nome: string;
  descricao?: string;
  criado_em: string;
  atualizado_em: string;
  apagado_em?: string | null;
};