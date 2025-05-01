import bcrypt from 'bcrypt';
import { CreateUserInputDTO } from '../dtos/user/CreateUserInput.dto';
import { UserOutputDTO } from '../dtos/user/UserOutput.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

export async function createUser(data: CreateUserInputDTO): Promise<UserOutputDTO> {
    const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await prisma.user.create({
        data: { name: data.name, email: data.email, password: hash },
    });
    return new UserOutputDTO(user);
}

export async function getAllUsers(): Promise<UserOutputDTO[]> {
    const users = await prisma.user.findMany();
    return users.map(u => new UserOutputDTO(u));
}