export interface Usuario {
    id: number;
    email: string;
    primeiro_nome: string;
    sobrenome: string;
    data_nascimento: string;
    idade?: number;
    status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO';
    criado_em: string;
    atualizado_em: string;
  }