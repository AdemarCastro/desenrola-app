import { Request, Response } from 'express';
import { CargoService } from '../services/cargo.service';

export class CargoController {
  static async getCargos(req: Request, res: Response) {
    const cargos = await CargoService.findAll();
    res.json(cargos);
  }

  static async getCargoById(req: Request, res: Response) {
    const cargo = await CargoService.findById(Number(req.params.id));
    if (!cargo) {
      res.status(404).json({ message: 'Cargo não encontrado' });
    }
    res.json(cargo);
  }

  static async createCargo(req: Request, res: Response) {
    const cargo = await CargoService.create(req.body);
    res.status(201).json(cargo);
  }

  static async updateCargo(req: Request, res: Response) {
    const cargo = await CargoService.update(Number(req.params.id), req.body);
    res.json(cargo);
  }

  static async deleteCargo(req: Request, res: Response) {
    await CargoService.delete(Number(req.params.id));
    res.status(204).send();
  }
}