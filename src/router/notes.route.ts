import { NOTES_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { CreateNote } from '../controllers/note.controller';
import { GetAllAggregate, GetByIdAggregate } from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate('notes'));

router.get('/:id', GetByIdAggregate('notes'));

router.post('/create', CreateNote);

export const NotesRouter = { router, path: NOTES_PATH };
