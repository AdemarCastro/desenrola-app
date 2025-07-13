import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  static async getDashboardData(req: Request, res: Response): Promise<void> {
    try {
      const projetoId = Number(req.params.projetoId);
      const data = await DashboardService.getDashboardData(projetoId);
      res.json(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      res.status(404).json({ error: message });
    }
  }
}