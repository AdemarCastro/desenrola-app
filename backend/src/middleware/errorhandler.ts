import { Request, Response } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response
) {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message || 'Ocorreu um erro inesperado',
  });
}