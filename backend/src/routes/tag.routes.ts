import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { TagController } from '../controllers/tag.controller';
import { validateTagCreate, validateTagUpdate, validateTagExists } from '../middleware/tag.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', TagController.getTags);
router.post('/', validateTagCreate, TagController.createTag);
router.get('/:id', validateTagExists, TagController.getTagById);
router.put('/:id', validateTagExists, validateTagUpdate, TagController.updateTag);
router.delete('/:id', validateTagExists, TagController.deleteTag);

export default router;