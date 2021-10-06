import { Request, Response, NextFunction } from 'express';
import { updateRepository } from '../repositories/common.repository';
import { createGroupValidation } from '../validations/criterion.validation';
import {
	ICriterionNoteDocument,
	ICriterionNoteModel,
	ICriterionProjectModel
} from '../interfaces/models.interface';

export const CreateGroup =
	(
		model: ICriterionNoteModel | ICriterionProjectModel,
		type: string
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { group } = req.params;
			const validateBody = await createGroupValidation.validateAsync(req.body);
			await updateRepository<ICriterionNoteDocument>(
				model as ICriterionNoteModel,
				{ $and: [{ type }, { _id: group }] },
				{ $push: { group: validateBody } }
			);
			res.sendStatus(202);
		} catch (err) {
			next(err);
		}
	};
