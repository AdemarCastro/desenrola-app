import { CreateUsuarioInputDTO } from '../dtos/usuario/CreateUsuarioInput.dto';
import type { UpdateUsuarioInputDTO } from '../dtos/usuario/UpdateUsuarioInput.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UsuarioRepository {
    static async findAll() {
        return prisma.usuario.findMany({
            where: { apagado_em: null },
            select: {
                id: true,
                email: true,
                primeiro_nome: true,
                sobrenome: true,
                data_nascimento: true,
                nivel_acesso_id: true,
                status_id: true,
                criado_em: true,
                atualizado_em: true,
            },
        })
    }

    static async findById(id: number) {
        return prisma.usuario.findFirst({
            where: { id, apagado_em: null },
            select: {
                id: true,
                email: true,
                primeiro_nome: true,
                sobrenome: true,
                data_nascimento: true,
                nivel_acesso_id: true,
                status_id: true,
                criado_em: true,
                atualizado_em: true,
            }
        });
    }

    static async findByEmailForAuth(email: string) {
        return prisma.usuario.findFirst({
            where: { email, apagado_em: null },
            select: {
                id: true,
                email: true,
                senha: true,
                nivel_acesso_id: true,
            }
        });
    }

    static async create(data: CreateUsuarioInputDTO) {
        const usuario = await prisma.usuario.create({
            data,
        });

        return prisma.usuario.findFirst({
            where: { id: usuario.id },
            select: {
                id: true,
                email: true,
                primeiro_nome: true,
                sobrenome: true,
                data_nascimento: true,
                nivel_acesso_id: true,
                status_id: true,
                criado_em: true,
                atualizado_em: true,
            },
        });
    }

    static async update(id: number, data: UpdateUsuarioInputDTO) {
        const usuario = await prisma.usuario.update({
            where: { id },
            data,
        });

        return prisma.usuario.findFirst({
            where: { id: usuario.id },
            select: {
                id: true,
                email: true,
                primeiro_nome: true,
                sobrenome: true,
                data_nascimento: true,
                nivel_acesso_id: true,
                status_id: true,
                criado_em: true,
                atualizado_em: true,
            },
        });
    }

    static async delete(id: number) {
        return prisma.usuario.update({
            where: { id },
            data: { apagado_em: new Date() },
        });
    }
}