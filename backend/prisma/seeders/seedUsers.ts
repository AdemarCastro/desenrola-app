import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
  const existingUsers = await prisma.usuario.findMany({
    select: { email: true },
  });

  const existingEmails = new Set(existingUsers.map((u) => u.email));

  const usersToSeed = [
    { email: 'user1@example.com', primeiro_nome: 'Ze', sobrenome: 'One', senha: 'password1', data_nascimento: new Date('1990-01-01') },
    { email: 'user2@example.com', primeiro_nome: 'Zezinho', sobrenome: 'Two', senha: 'password2', data_nascimento: new Date('1992-02-02') },
  ];

  const newUsers = usersToSeed.filter((u) => !existingEmails.has(u.email));

  if (newUsers.length > 0) {
    await prisma.usuario.createMany({
      data: newUsers,
    });
    console.log(`${newUsers.length} usuários criados.`);
  } else {
    console.log('Nenhum novo usuário para criar.');
  }
}

seedUsers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { seedUsers };