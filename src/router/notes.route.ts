import { NOTES_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import {
	CreateMessage,
	CreateNote,
	GroupNotes,
	UpdateMessage,
	UpdateNote
} from '../controllers/note.controller';
import {
	GetAllAggregate,
	GetByIdAggregate,
	GetByQueryAggregate
} from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate('notes'));

router.get('/group', GroupNotes);

router.get('/filter', GetByQueryAggregate('notes'));

router.get('/:id', GetByIdAggregate('notes'));

router.post('/create', CreateNote);

router.put('/:id', UpdateNote);

router.post('/:id/message/create', CreateMessage);

router.put('/:id/message/:id', UpdateMessage);

export const NotesRouter = { router, path: NOTES_PATH };
