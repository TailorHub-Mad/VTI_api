import { TAG_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { createTagValidation, updateTagValidation } from '../validations/tag.validation';
import { CreateTag, UpdateTag } from '../controllers/tag.controller';
import { TagNoteModel } from '../models/tag_notes.model';
import { TagProjectModel } from '../models/tag_project.model';
import { ITagNoteDocument, ITagProjectDocument } from '../interfaces/models.interface';
import { DeleteCrud, GetAll } from '../controllers/crud.controller';

const router = Router();

router.get('/notes', GetAll<ITagNoteDocument>(TagNoteModel, { path: 'relatedTags parent' }));

router.get(
	'/projects',
	GetAll<ITagProjectDocument>(TagProjectModel, { path: 'relatedTags parent' })
);

router.post('/notes', CreateTag<ITagNoteDocument>(TagNoteModel, createTagValidation));

router.post('/projects', CreateTag<ITagProjectDocument>(TagProjectModel, createTagValidation));

router.put('/notes/:id_tag', UpdateTag<ITagNoteDocument>(TagNoteModel, updateTagValidation));

router.put(
	'/projects/:id_tag',
	UpdateTag<ITagProjectDocument>(TagProjectModel, updateTagValidation)
);

router.delete('/projects/:id', DeleteCrud<ITagProjectDocument>(TagProjectModel));

router.delete('/notes/:id', DeleteCrud<ITagNoteDocument>(TagNoteModel));

export const TagRouter = { router, path: TAG_PATH };
