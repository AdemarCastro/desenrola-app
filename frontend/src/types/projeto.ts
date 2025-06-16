export type Projeto = {
  id: number;
  nome: string;
  progresso: number;
  descricao?: string;
  data_entrega?: string;
  criado_em: string;
  atualizado_em: string;
  apagado_em?: string | null;
};