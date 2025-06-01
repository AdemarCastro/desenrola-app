import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  void _next;
  console.error('[Error Handler]', err.stack);
  if (typeof res.status === 'function') {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: err.message || 'Ocorreu um erro inesperado',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  } else {
    console.error('Objeto response inválido:', res);
    process.stderr.write(`ERROR: ${err.message}\n${err.stack}\n`);
  }
}