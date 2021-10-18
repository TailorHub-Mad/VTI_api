import { Request, Response, NextFunction } from 'express';
import { updateRepository } from '../repositories/common.repository';
import { createGroupValidation } from '../validations/criterion.validation';
import {
	GenericModel,
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

export const GetTagsNotUse =
	<Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
		model: M,
		type: string
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const pipeline = [
				{
					$lookup: {
						from: 'criterions',
						let: {
							id: '$_id'
						},
						pipeline: [
							{
								$match: {
									type
								}
							},
							{
								$unwind: {
									path: '$group'
								}
							},
							{
								$unwind: {
									path: '$group.relatedTags'
								}
							},
							{
								$match: {
									$expr: {
										$eq: ['$$id', '$group.relatedTags']
									}
								}
							}
						],
						as: 'string'
					}
				},
				{
					$addFields: {
						isUsed: {
							$cond: {
								if: { $eq: [{ $size: ['$string'] }, 0] },
								then: false,
								else: true
							}
						}
					}
				},
				{
					$project: {
						string: 0
					}
				}
			];
			const tags = await model.aggregate(pipeline);
			res.status(200).json(tags);
		} catch (err) {
			next(err);
		}
	};
