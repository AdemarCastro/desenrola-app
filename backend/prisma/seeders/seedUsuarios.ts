import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

if (process.env.SALT_ROUNDS === undefined) {
  console.error('🔴 Erro: SALT_ROUNDS não definido no ambiente. Verifique o arquivo .env.');
  process.exit(1);
}

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);
const prisma = new PrismaClient();

interface UserSeed {
  primeiro_nome: string;
  sobrenome: string;
  email: string;
  senha: string;
  data_nascimento: string;
  avatar_url?: string; // opcional
  status_id: number;
  nivel_acesso_id: number;
  cargo_id: number;
}

const usersToSeed: UserSeed[] = [
  // Usuário Admin Principal
  { primeiro_nome: 'Admin', sobrenome: 'Principal', email: 'admin@desenrola.com', senha: 'admin123', data_nascimento: '1980-01-01', status_id: 1, nivel_acesso_id: 1, cargo_id: 4 },

  // Liderança e Gestão (nível 1 e 2)
  { primeiro_nome: 'Alice', sobrenome: 'Rodrigues', email: 'alice.rodrigues@desenrola.com', senha: 'senha123', data_nascimento: '1985-04-12', status_id: 1, nivel_acesso_id: 1, cargo_id: 4 },
  { primeiro_nome: 'Bruno', sobrenome: 'Fernandes', email: 'bruno.fernandes@desenrola.com', senha: 'senha123', data_nascimento: '1988-09-20', status_id: 1, nivel_acesso_id: 2, cargo_id: 4 },
  { primeiro_nome: 'Carla', sobrenome: 'Mendes', email: 'carla.mendes@desenrola.com', senha: 'senha123', data_nascimento: '1990-02-25', status_id: 1, nivel_acesso_id: 2, cargo_id: 4 },
  { primeiro_nome: 'Diego', sobrenome: 'Almeida', email: 'diego.almeida@desenrola.com', senha: 'senha123', data_nascimento: '1982-11-05', status_id: 1, nivel_acesso_id: 2, cargo_id: 4 },

  // Equipe de Desenvolvimento (nível 3)
  { primeiro_nome: 'Eduarda', sobrenome: 'Gomes', email: 'eduarda.gomes@desenrola.com', senha: 'senha123', data_nascimento: '1995-07-19', status_id: 1, nivel_acesso_id: 3, cargo_id: 2 },
  { primeiro_nome: 'Fábio', sobrenome: 'Nogueira', email: 'fabio.nogueira@desenrola.com', senha: 'senha123', data_nascimento: '1998-01-30', status_id: 1, nivel_acesso_id: 3, cargo_id: 2 },
  { primeiro_nome: 'Gabriela', sobrenome: 'Lima', email: 'gabriela.lima@desenrola.com', senha: 'senha123', data_nascimento: '1997-06-15', status_id: 1, nivel_acesso_id: 3, cargo_id: 1 },
  { primeiro_nome: 'Heitor', sobrenome: 'Ribeiro', email: 'heitor.ribeiro@desenrola.com', senha: 'senha123', data_nascimento: '2000-12-01', status_id: 1, nivel_acesso_id: 3, cargo_id: 1 },
  { primeiro_nome: 'Isabela', sobrenome: 'Martins', email: 'isabela.martins@desenrola.com', senha: 'senha123', data_nascimento: '1999-08-22', status_id: 1, nivel_acesso_id: 3, cargo_id: 5 },
  { primeiro_nome: 'João', sobrenome: 'Carvalho', email: 'joao.carvalho@desenrola.com', senha: 'senha123', data_nascimento: '1996-04-10', status_id: 1, nivel_acesso_id: 3, cargo_id: 5 },

  // Equipe de UI/UX Design (nível 3)
  { primeiro_nome: 'Larissa', sobrenome: 'Oliveira', email: 'larissa.oliveira@desenrola.com', senha: 'senha123', data_nascimento: '1994-03-18', status_id: 1, nivel_acesso_id: 3, cargo_id: 3 },
  { primeiro_nome: 'Marcos', sobrenome: 'Ferreira', email: 'marcos.ferreira@desenrola.com', senha: 'senha123', data_nascimento: '1993-10-14', status_id: 1, nivel_acesso_id: 3, cargo_id: 3 },
  { primeiro_nome: 'Natália', sobrenome: 'Souza', email: 'natalia.souza@desenrola.com', senha: 'senha123', data_nascimento: '1997-05-28', status_id: 1, nivel_acesso_id: 3, cargo_id: 6 },

  // Equipe de Marketing (agora DevOps) e outros (nível 3)
  { primeiro_nome: 'Otávio', sobrenome: 'Pereira', email: 'otavio.pereira@desenrola.com', senha: 'senha123', data_nascimento: '1992-08-08', status_id: 1, nivel_acesso_id: 3, cargo_id: 6 },
  { primeiro_nome: 'Patrícia', sobrenome: 'Santos', email: 'patricia.santos@desenrola.com', senha: 'senha123', data_nascimento: '1991-01-12', status_id: 1, nivel_acesso_id: 3, cargo_id: 1 },
  { primeiro_nome: 'Ricardo', sobrenome: 'Dias', email: 'ricardo.dias@desenrola.com', senha: 'senha123', data_nascimento: '1993-09-03', status_id: 1, nivel_acesso_id: 3, cargo_id: 2 },

  // Equipe de QA (nível 3)
  { primeiro_nome: 'Sofia', sobrenome: 'Andrade', email: 'sofia.andrade@desenrola.com', senha: 'senha123', data_nascimento: '1998-07-07', status_id: 1, nivel_acesso_id: 3, cargo_id: 5 },
  { primeiro_nome: 'Thiago', sobrenome: 'Barbosa', email: 'thiago.barbosa@desenrola.com', senha: 'senha123', data_nascimento: '1996-02-15', status_id: 1, nivel_acesso_id: 3, cargo_id: 3 },

  // Usuários com status diferentes
  { primeiro_nome: 'Vitória', sobrenome: 'Rocha', email: 'vitoria.rocha@desenrola.com', senha: 'senha123', data_nascimento: '1999-10-10', status_id: 2, nivel_acesso_id: 3, cargo_id: 1 },
  { primeiro_nome: 'William', sobrenome: 'Nunes', email: 'william.nunes@desenrola.com', senha: 'senha123', data_nascimento: '1990-12-12', status_id: 3, nivel_acesso_id: 3, cargo_id: 2 },
];

export async function seedUsuarios() {
  try {
    console.log('🔎 Verificando usuários existentes no banco...');

    for (const user of usersToSeed) {
      await prisma.usuario.upsert({
        where: { email: user.email },
        create: {
          primeiro_nome: user.primeiro_nome,
          sobrenome: user.sobrenome,
          email: user.email,
          senha: await bcrypt.hash(user.senha, SALT_ROUNDS),
          data_nascimento: new Date(user.data_nascimento),
          avatar_url: user.avatar_url || null,
          status_id: user.status_id,
          nivel_acesso_id: user.nivel_acesso_id,
          cargo_id: user.cargo_id,
        },
        update: {
          // vazio - mantemos dados existentes
        },
      });
      console.log(`✅ Usuário upsertado: ${user.email}`);
    }

    console.log('🟢 Seed de usuários concluído com sucesso!');
  } catch (error: unknown) {
    console.error('🔴 Erro no seed de usuários:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}