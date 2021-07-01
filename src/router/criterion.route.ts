import { Router } from 'express';
import { CriterionProjectModel } from 'src/models/criterion_project.model';
import { CriterionCreateValidation } from 'src/validations/criterion.validation';
import { Create } from '../controllers/crud.controller';
import { ICriterionNoteDocument, ICriterionProjectDocument } from '../interfaces/models.interface';
import { CriterionNoteModel } from '../models/criterion_note.model';

const router = Router();

router.post(
	'/notes',
	Create<ICriterionNoteDocument>(CriterionNoteModel, CriterionCreateValidation)
);

router.post(
	'/project',
	Create<ICriterionProjectDocument>(CriterionProjectModel, CriterionCreateValidation)
);

export const CriterionRouter = { router, path: '/criterion' };
