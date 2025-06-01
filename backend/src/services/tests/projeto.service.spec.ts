import { ProjetoService } from '../projeto.service';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mPrisma = {
    projeto: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    projetoUsuario: {
      findMany: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
    },
    tarefa: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('ProjetoService', () => {
  let service: ProjetoService;
  let prismaMock: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    service = new ProjetoService();
    prismaMock = new PrismaClient() as any;
  });

  it('deve retornar projetos paginados (findAll)', async () => {
    const projetos = [{ id: 1, nome: 'Projeto A', descricao: null, apagado_em: null, criado_em: new Date() }];
    prismaMock.projeto.findMany.mockResolvedValue(projetos as any);

    const result = await service.findAll(1, 10);

    expect(prismaMock.projeto.findMany).toHaveBeenCalledWith({
      where: { apagado_em: null },
      skip: 0,
      take: 10,
      orderBy: { criado_em: 'desc' },
    });
    expect(result).toEqual([{ ...projetos[0], descricao: undefined }]);
  });

  it('deve buscar projeto por ID (findById)', async () => {
    const projeto = { id: 1, nome: 'Projeto A', apagado_em: null };
    prismaMock.projeto.findFirst.mockResolvedValue(projeto as any);

    const result = await service.findById(1);

    expect(prismaMock.projeto.findFirst).toHaveBeenCalledWith({
      where: { id: 1, apagado_em: null },
    });
    expect(result).toEqual(projeto);
  });

  it('deve criar um projeto (create)', async () => {
    const data = { nome: 'Projeto B' };
    const created = { id: 2, ...data };
    prismaMock.projeto.create.mockResolvedValue(created as any);

    const result = await service.create(data);

    expect(prismaMock.projeto.create).toHaveBeenCalledWith({ data });
    expect(result).toEqual(created);
  });

  it('deve atualizar um projeto (update)', async () => {
    const data = { nome: 'Projeto Atualizado' };
    const updated = { id: 1, ...data };
    prismaMock.projeto.update.mockResolvedValue(updated as any);

    const result = await service.update(1, data);

    expect(prismaMock.projeto.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data,
    });
    expect(result).toEqual(updated);
  });

  it('deve marcar projeto como apagado (delete)', async () => {
    prismaMock.projeto.update.mockResolvedValue({} as any);

    await service.delete(1);

    expect(prismaMock.projeto.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { apagado_em: expect.any(Date) },
    });
  });

  it('deve listar usuários de um projeto (listUsuarios)', async () => {
    const usuarios = [
      {
        usuario: { id: 1, primeiro_nome: 'João', sobrenome: 'Silva' },
        nivel_acesso: { id: 1, nome: 'Admin' },
      },
    ];
    prismaMock.projetoUsuario.findMany.mockResolvedValue(usuarios as any);

    const result = await service.listUsuarios(1);

    expect(prismaMock.projetoUsuario.findMany).toHaveBeenCalledWith({
      where: { projeto_id: 1, apagado_em: null },
      include: {
        usuario: { select: { id: true, primeiro_nome: true, sobrenome: true } },
        nivel_acesso: { select: { id: true, nome: true } },
      },
    });
    expect(result).toEqual(usuarios);
  });

  it('deve adicionar um usuário ao projeto (addUsuario)', async () => {
    const record = { id: 1, projeto_id: 1, usuario_id: 2, nivel_acesso_id: 3 };
    prismaMock.projetoUsuario.create.mockResolvedValue(record as any);

    const result = await service.addUsuario(1, 2, 3);

    expect(prismaMock.projetoUsuario.create).toHaveBeenCalledWith({
      data: { projeto_id: 1, usuario_id: 2, nivel_acesso_id: 3 },
    });
    expect(result).toEqual(record);
  });

  it('deve atualizar nível de acesso do usuário (updateUsuario)', async () => {
    prismaMock.projetoUsuario.updateMany.mockResolvedValue({ count: 1 });

    const result = await service.updateUsuario(1, 2, 3);

    expect(prismaMock.projetoUsuario.updateMany).toHaveBeenCalledWith({
      where: { projeto_id: 1, usuario_id: 2 },
      data: { nivel_acesso_id: 3 },
    });
    expect(result).toEqual({ count: 1 });
  });

  it('deve remover usuário do projeto (removeUsuario)', async () => {
    prismaMock.projetoUsuario.updateMany.mockResolvedValue({ count: 1 });

    const result = await service.removeUsuario(1, 2);

    expect(prismaMock.projetoUsuario.updateMany).toHaveBeenCalledWith({
      where: { projeto_id: 1, usuario_id: 2, apagado_em: null },
      data: { apagado_em: expect.any(Date) },
    });
    expect(result).toEqual({ count: 1 });
  });

  it('deve listar tarefas do projeto (listTarefas)', async () => {
    const tarefas = [{ id: 1, titulo: 'Tarefa 1', id_projeto: 1, apagado_em: null }];
    prismaMock.tarefa.findMany.mockResolvedValue(tarefas as any);

    const result = await service.listTarefas(1);

    expect(prismaMock.tarefa.findMany).toHaveBeenCalledWith({
      where: { id_projeto: 1, apagado_em: null },
    });
    expect(result).toEqual(tarefas);
  });
});
