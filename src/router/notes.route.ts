import { NOTES_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { GetAllAggregate, GetByIdAggregate } from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate('notes'));

router.get('/:id', GetByIdAggregate('notes'));

export const NotesRouter = { router, path: NOTES_PATH };
