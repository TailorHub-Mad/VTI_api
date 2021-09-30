import { Router } from 'express';
import { CriterionProjectModel } from '../models/criterion_project.model';
import {
	CriterionCreateValidation,
	CriterionUpdateValidation
} from '../validations/criterion.validation';
import { Create, Read, Update } from '../controllers/crud.controller';
import { ICriterionNoteDocument, ICriterionProjectDocument } from '../interfaces/models.interface';
import { CriterionNoteModel } from '../models/criterion_note.model';

const router = Router();

router.get(
	'/notes',
	Read<ICriterionNoteDocument>(CriterionNoteModel, { type: 'note' }, { path: 'relatedTags' })
);

router.get(
	'/project',
	Read<ICriterionProjectDocument>(
		CriterionProjectModel,
		{ type: 'project' },
		{ path: 'relatedTags' }
	)
);

router.post(
	'/notes',
	Create<ICriterionNoteDocument>(CriterionNoteModel, CriterionCreateValidation)
);

router.post(
	'/project',
	Create<ICriterionProjectDocument>(CriterionProjectModel, CriterionCreateValidation)
);

router.put('/notes', Update<ICriterionNoteDocument>(CriterionNoteModel, CriterionUpdateValidation));

router.put(
	'/project',
	Update<ICriterionProjectDocument>(CriterionProjectModel, CriterionUpdateValidation)
);

export const CriterionRouter = { router, path: '/criterion' };
