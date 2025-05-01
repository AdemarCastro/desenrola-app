import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedUsers() {

  await prisma.user.createMany({
    data: [
      {
        name: 'Ademar',
        email: 'ademar@email.com',
        password: await bcrypt.hash('2022002444', 10),
      },
      {
        name: 'Alice',
        email: 'alice@email.com',
        password: await bcrypt.hash('2022002453', 10),
      },
      {
        name: 'Carlos',
        email: 'carlos@email.com',
        password: await bcrypt.hash('2022004322', 10),
      },
      {
        name: 'Jorge',
        email: 'jorge@email.com',
        password: await bcrypt.hash('2022005160', 10),
      },
      {
        name: 'Lucas',
        email: 'lucas@email.com',
        password: await bcrypt.hash('2022006229', 10),
      },
    ],
  });

  console.log('🟢 Users seeded concluído!');
}