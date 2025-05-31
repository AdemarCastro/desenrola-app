import { ComentarioService } from '../comentario.service';
import { PrismaClient } from '@prisma/client';

// Mock do Prisma
jest.mock('@prisma/client', () => {
  const mPrisma = {
    comentario: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('ComentarioService', () => {
  let service: ComentarioService;
  let prismaMock: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    service = new ComentarioService();
    prismaMock = new PrismaClient() as any;
  });

  it('deve retornar todos os comentários (findAll)', async () => {
    const comentarios = [{ id: 1, conteudo: 'Teste', apagado_em: null }];
    prismaMock.comentario.findMany.mockResolvedValue(comentarios as any);

    const result = await service.findAll(1, 10);

    expect(prismaMock.comentario.findMany).toHaveBeenCalledWith({
      where: { apagado_em: null },
      skip: 0,
      take: 10,
    });
    expect(result).toEqual(comentarios);
  });

  it('deve retornar um comentário por ID (findById)', async () => {
    const comentario = { id: 1, conteudo: 'Comentário', apagado_em: null };
    prismaMock.comentario.findFirst.mockResolvedValue(comentario as any);

    const result = await service.findById(1);

    expect(prismaMock.comentario.findFirst).toHaveBeenCalledWith({
      where: { id: 1, apagado_em: null },
    });
    expect(result).toEqual(comentario);
  });

  it('deve criar um comentário (create)', async () => {
    const input = { conteudo: 'Novo comentário', id_tarefa: 1, id_usuario: 2 };
    const created = { id: 1, ...input, apagado_em: null };
    prismaMock.comentario.create.mockResolvedValue(created as any);

    const result = await service.create(input);

    expect(prismaMock.comentario.create).toHaveBeenCalledWith({ data: input });
    expect(result).toEqual(created);
  });

  it('deve atualizar um comentário (update)', async () => {
    const input = { conteudo: 'Atualizado' };
    const updated = { id: 1, conteudo: 'Atualizado', apagado_em: null };
    prismaMock.comentario.update.mockResolvedValue(updated as any);

    const result = await service.update(1, input);

    expect(prismaMock.comentario.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: input,
    });
    expect(result).toEqual(updated);
  });

  it('deve marcar comentário como apagado (delete)', async () => {
    prismaMock.comentario.update.mockResolvedValue({} as any);

    await service.delete(1);

    expect(prismaMock.comentario.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { apagado_em: expect.any(Date) },
    });
  });
});
