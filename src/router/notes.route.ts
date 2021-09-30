import { NOTES_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import {
	CreateMessage,
	CreateNote,
	DeleteMessage,
	DeleteNote,
	DownloadDocumentMessage,
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
import multerConfig from '../config/multer.config';

const router = Router();

router.get('/', GetAllAggregate('notes'));

router.get('/group', GroupNotes);

router.get('/filter', GetByQueryAggregate('notes'));

router.get('/download/:document', DownloadDocumentNote);

router.get('/message/download/:document', DownloadDocumentMessage);

router.get('/:id', GetByIdAggregate('notes'));

router.post('/create', multerConfig.array('file'), CreateNote);

router.put('/:id', multerConfig.array('file'), UpdateNote);

router.post('/:id/message/create', multerConfig.array('file'), CreateMessage);

router.put('/:id/message/:id', multerConfig.array('file'), UpdateMessage);

router.delete('/:id_note', DeleteNote);

router.delete('/:id_note/message/:id_message', DeleteMessage);

export const NotesRouter = { router, path: NOTES_PATH };
