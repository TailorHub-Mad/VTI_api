import { Router } from 'express';
import { CriterionProjectModel } from '../models/criterion_project.model';
import {
	CriterionCreateValidation,
	CriterionUpdateValidation,
	filterCriterionValidation
} from '../validations/criterion.validation';
import { Create, Read, Update } from '../controllers/crud.controller';
import { ICriterionNoteDocument, ICriterionProjectDocument } from '../interfaces/models.interface';
import { CriterionNoteModel } from '../models/criterion_note.model';
import { FilterClient } from '../controllers/client.controller';
import { CreateGroup } from '../controllers/criterion.controller';

const router = Router();

router.get(
	'/notes',
	Read<ICriterionNoteDocument>(CriterionNoteModel, { type: 'note' }, { path: 'group.relatedTags' })
);

router.get(
	'/project',
	Read<ICriterionProjectDocument>(
		CriterionProjectModel,
		{ type: 'project' },
		{ path: 'group.relatedTags parent' }
	)
);

router.get(
	'/notes/filter',
	FilterClient<ICriterionNoteDocument>(CriterionNoteModel, filterCriterionValidation, {
		path: 'group.relatedTags parent'
	})
);

router.get(
	'/project/filter',
	FilterClient<ICriterionProjectDocument>(CriterionProjectModel, filterCriterionValidation, {
		path: 'group.relatedTags parent'
	})
);

router.post(
	'/notes',
	Create<ICriterionNoteDocument>(CriterionNoteModel, CriterionCreateValidation)
);

router.post(
	'/project',
	Create<ICriterionProjectDocument>(CriterionProjectModel, CriterionCreateValidation)
);

router.put('/notes/:group', CreateGroup(CriterionNoteModel, 'note'));

router.put('/project/:group', CreateGroup(CriterionProjectModel, 'project'));

router.put(
	'/notes/update/:id',
	Update<ICriterionNoteDocument>(CriterionNoteModel, CriterionUpdateValidation)
);

router.put(
	'/project/update/:id',
	Update<ICriterionProjectDocument>(CriterionProjectModel, CriterionUpdateValidation)
);

export const CriterionRouter = { router, path: '/criterion' };
