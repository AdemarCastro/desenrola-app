import { Request, Response } from 'express';
import { TagService } from '../services/tag.service';

export class TagController {
  static async getTags(req: Request, res: Response) {
    const tags = await TagService.findAll();
    res.json(tags);
  }

  static async getTagById(req: Request, res: Response) {
    const tag = await TagService.findById(Number(req.params.id));
    if (!tag) {
      res.status(404).json({ message: 'Tag não encontrada' });
    }
    res.json(tag);
  }

  static async createTag(req: Request, res: Response) {
    const tag = await TagService.create(req.body);
    res.status(201).json(tag);
  }

  static async updateTag(req: Request, res: Response) {
    const tag = await TagService.update(Number(req.params.id), req.body);
    res.json(tag);
  }

  static async deleteTag(req: Request, res: Response) {
    await TagService.delete(Number(req.params.id));
    res.status(204).send();
  }
}