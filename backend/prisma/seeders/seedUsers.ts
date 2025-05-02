import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const usersToSeed = [
  { name: 'Ademar', email: 'ademar@email.com', password: '2022002444' },
  { name: 'Alice', email: 'alice@email.com', password: '2022002453' },
  { name: 'Carlos', email: 'carlos@email.com', password: '2022004322' },
  { name: 'Jorge', email: 'jorge@email.com', password: '2022005160' },
  { name: 'Lucas', email: 'lucas@email.com', password: '2022006229' },
];

export async function seedUsers() {
  try {
    console.log('🔎 Verificando usuários existentes no banco...');

    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          in: usersToSeed.map(user => user.email),
        },
      },
      select: {
        email: true,
      },
    });

    const existingEmails = new Set(existingUsers.map(u => u.email));
    const usersToInsert = usersToSeed.filter(user => !existingEmails.has(user.email));

    if (usersToInsert.length === 0) {
      console.log('⚠️ Todos os usuários do seed já existem.');
      return;
    }

    console.log(`📥 Inserindo ${usersToInsert.length} usuário(s)...`);

    await prisma.user.createMany({
      data: await Promise.all(
        usersToInsert.map(async user => ({
          name: user.name,
          email: user.email,
          password: await bcrypt.hash(user.password, 10),
        }))
      ),
    });

    console.log('🟢 Inserção de usuários concluída com sucesso!');
  } catch (error) {
    console.error('🔴 Erro no seed users:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}