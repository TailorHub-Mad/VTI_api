import { NOTES_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import {
	CreateMessage,
	CreateNote,
	DownloadDocumentNote,
	GroupNotes,
	UpdateMessage,
	UpdateNote
} from '../controllers/note.controller';
import {
	GetAllAggregate,
	GetByIdAggregate,
	GetByQueryAggregate
} from '../controllers/crud.controller';
import multerConfig from 'src/config/multer.config';

const router = Router();

router.get('/', GetAllAggregate('notes'));

router.get('/group', GroupNotes);

router.get('/filter', GetByQueryAggregate('notes'));

router.get('/download/:document', DownloadDocumentNote);

router.get('/:id', GetByIdAggregate('notes'));

router.post('/create', multerConfig.array('file'), CreateNote);

router.put('/:id', multerConfig.array('file'), UpdateNote);

router.post('/:id/message/create', CreateMessage);

router.put('/:id/message/:id', UpdateMessage);

export const NotesRouter = { router, path: NOTES_PATH };
