import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateCargoInputDto, UpdateCargoInputDto } from '../dtos/cargo/CargoInput.dto';
import { CargoRepository } from '../repository/cargo.repository';

export async function validateCargoCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const dto = plainToInstance(CreateCargoInputDto, req.body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
}

export async function validateCargoUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const dto = plainToInstance(UpdateCargoInputDto, req.body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
}

export async function validateCargoExists(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id = Number(req.params.id);
  if (isNaN(id)) {
      res.status(400).json({ error: 'ID do cargo inválido' });
      return;
  }
  const cargo = await CargoRepository.findById(id);
  if (!cargo) {
    res.status(404).json({ error: 'Cargo não encontrado' });
    return;
  }
  next();
}