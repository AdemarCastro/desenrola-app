import { Request, Response, NextFunction } from 'express';
import { validateDto } from '../validation.middleware';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

jest.mock('class-validator', () => ({
  validate: jest.fn(),
}));

jest.mock('class-transformer', () => ({
  plainToInstance: jest.fn((cls, obj) => obj),
}));

class DummyDto {
  field!: string;
}

describe('validateDto middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    req = { body: { field: 'value' } };
    mockStatus = jest.fn().mockReturnThis();
    mockJson = jest.fn();
    res = {
      status: mockStatus,
      json: mockJson,
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('deve chamar next quando não há erros de validação', async () => {
    (validate as jest.Mock).mockResolvedValue([]);

    const middleware = validateDto(DummyDto);
    await middleware(req as Request, res as Response, next);

    expect(validate).toHaveBeenCalledWith(req.body, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    expect(next).toHaveBeenCalled();
    expect(mockStatus).not.toHaveBeenCalled();
    expect(mockJson).not.toHaveBeenCalled();
  });

  it('deve retornar 400 e mensagens de erro quando há erros de validação', async () => {
    const errors = [
      { constraints: { isNotEmpty: 'field não pode estar vazio' } },
      { constraints: { isString: 'field deve ser uma string' } },
    ];

    (validate as jest.Mock).mockResolvedValue(errors);

    const middleware = validateDto(DummyDto);
    await middleware(req as Request, res as Response, next);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      errors: ['field não pode estar vazio', 'field deve ser uma string'],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
