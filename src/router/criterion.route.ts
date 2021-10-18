import { Router } from 'express';
import { CriterionProjectModel } from '../models/criterion_project.model';
import {
	CriterionCreateValidation,
	CriterionUpdateValidation,
	filterCriterionValidation
} from '../validations/criterion.validation';
import { Create, DeleteCrud, Read, Update } from '../controllers/crud.controller';
import {
	ICriterionNoteDocument,
	ICriterionProjectDocument,
	ITagNoteDocument,
	ITagProjectDocument
} from '../interfaces/models.interface';
import { CriterionNoteModel } from '../models/criterion_note.model';
import { FilterClient } from '../controllers/client.controller';
import { CreateGroup, GetTagsNotUse } from '../controllers/criterion.controller';
import { TagNoteModel } from '../models/tag_notes.model';
import { TagProjectModel } from '../models/tag_project.model';

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

router.get('/notes/tags', GetTagsNotUse<ITagNoteDocument>(TagNoteModel, 'note'));
router.get('/project/tags', GetTagsNotUse<ITagProjectDocument>(TagProjectModel, 'project'));

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

router.delete('/projects/:id', DeleteCrud<ICriterionProjectDocument>(CriterionProjectModel));

router.delete('/notes/:id', DeleteCrud<ICriterionNoteDocument>(CriterionNoteModel));

export const CriterionRouter = { router, path: '/criterion' };
