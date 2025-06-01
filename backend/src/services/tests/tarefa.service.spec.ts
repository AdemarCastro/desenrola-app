import { TarefaService } from '../tarefa.service';
import { PrismaClient } from '@prisma/client';

// Mocks do Prisma
jest.mock('@prisma/client', () => {
  const mPrisma = {
    tarefa: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    comentario: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('TarefaService', () => {
  let service: TarefaService;
  let prismaMock: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    service = new TarefaService();
    prismaMock = new PrismaClient() as any;
  });

  it('deve retornar todas as tarefas (findAll)', async () => {
    const tarefas = [{ id: 1, descricao: 'Teste', apagado_em: null }];
    prismaMock.tarefa.findMany.mockResolvedValue(tarefas as any);

    const result = await service.findAll(1, 10);

    expect(prismaMock.tarefa.findMany).toHaveBeenCalledWith({
      where: { apagado_em: null },
      skip: 0,
      take: 10,
    });
    expect(result).toEqual(tarefas);
  });

  it('deve retornar uma tarefa pelo ID (findById)', async () => {
    const tarefa = { id: 1, descricao: 'Teste', apagado_em: null };
    prismaMock.tarefa.findFirst.mockResolvedValue(tarefa as any);

    const result = await service.findById(1);

    expect(prismaMock.tarefa.findFirst).toHaveBeenCalledWith({
      where: { id: 1, apagado_em: null },
    });
    expect(result).toEqual(tarefa);
  });

  it('deve criar uma nova tarefa (create)', async () => {
    const input = {
      descricao: 'Nova tarefa',
      status_id: 1,
      prioridade_id: 2,
      id_projeto: 3,
    };
    const created = { id: 1, ...input, apagado_em: null };
    prismaMock.tarefa.create.mockResolvedValue(created as any);

    const result = await service.create(input);

    expect(prismaMock.tarefa.create).toHaveBeenCalledWith({ data: input });
    expect(result).toEqual(created);
  });

  it('deve atualizar uma tarefa (update)', async () => {
    const updateData = { descricao: 'Atualizado', status_id: 2 };
    const updated = { id: 1, ...updateData, prioridade_id: 1, apagado_em: null };
    prismaMock.tarefa.update.mockResolvedValue(updated as any);

    const result = await service.update(1, updateData);

    expect(prismaMock.tarefa.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateData,
    });
    expect(result).toEqual(updated);
  });

  it('deve marcar tarefa como apagada (delete)', async () => {
    prismaMock.tarefa.update.mockResolvedValue({} as any);

    await service.delete(1);

    expect(prismaMock.tarefa.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { apagado_em: expect.any(Date) },
    });
  });

  it('deve retornar comentários de uma tarefa (getComentariosByTarefa)', async () => {
    const comentarios = [{ id: 1, conteudo: 'comentário', id_tarefa: 1 }];
    prismaMock.comentario.findMany.mockResolvedValue(comentarios as any);

    const result = await service.getComentariosByTarefa(1);

    expect(prismaMock.comentario.findMany).toHaveBeenCalledWith({
      where: { id_tarefa: 1, apagado_em: null },
    });
    expect(result).toEqual(comentarios);
  });
});
