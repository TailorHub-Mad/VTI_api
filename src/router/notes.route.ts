import { NOTES_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { CreateMessage, CreateNote } from '../controllers/note.controller';
import { GetAllAggregate, GetByIdAggregate } from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate('notes'));

router.get('/:id', GetByIdAggregate('notes'));

router.post('/create', CreateNote);

router.post('/:id/message/create', CreateMessage);

export const NotesRouter = { router, path: NOTES_PATH };
