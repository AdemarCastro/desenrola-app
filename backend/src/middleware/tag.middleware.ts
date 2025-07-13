import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTagInputDto, UpdateTagInputDto } from '../dtos/tag/TagInput.dto';
import { TagRepository } from '../repository/tag.repository';

export async function validateTagCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const dto = plainToInstance(CreateTagInputDto, req.body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
}

export async function validateTagUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const dto = plainToInstance(UpdateTagInputDto, req.body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
}

export async function validateTagExists(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id = Number(req.params.id);
   if (isNaN(id)) {
      res.status(400).json({ error: 'ID da tag inválido' });
      return;
  }
  const tag = await TagRepository.findById(id);
  if (!tag) {
    res.status(404).json({ error: 'Tag não encontrada' });
    return;
  }
  next();
}