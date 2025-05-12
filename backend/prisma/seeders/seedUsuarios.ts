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
  status_id: number;
  nivel_acesso_id: number;
}

const usersToSeed: UserSeed[] = [
  {
    primeiro_nome: 'Admin',
    sobrenome: 'Principal',
    email: 'admin@exemplo.com',
    senha: 'admin123',
    data_nascimento: '1980-01-01',
    status_id: 1,
    nivel_acesso_id: 1,
  },
  {
    primeiro_nome: 'Membro',
    sobrenome: 'Exemplo',
    email: 'membro@exemplo.com',
    senha: 'membro123',
    data_nascimento: '1990-05-15',
    status_id: 1,
    nivel_acesso_id: 2,
  },
  {
    primeiro_nome: 'Carlos',
    sobrenome: 'Silva',
    email: 'carlos@exemplo.com',
    senha: 'carlos123',
    data_nascimento: '1992-07-20',
    status_id: 1,
    nivel_acesso_id: 2,
  },
  {
    primeiro_nome: 'Ana',
    sobrenome: 'Pereira',
    email: 'ana@exemplo.com',
    senha: 'ana123',
    data_nascimento: '1985-03-10',
    status_id: 1,
    nivel_acesso_id: 2,
  },
  {
    primeiro_nome: 'Beatriz',
    sobrenome: 'Costa',
    email: 'beatriz@exemplo.com',
    senha: 'beatriz123',
    data_nascimento: '1995-11-30',
    status_id: 1,
    nivel_acesso_id: 2,
  },
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
          status_id: user.status_id,
          nivel_acesso_id: user.nivel_acesso_id,
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