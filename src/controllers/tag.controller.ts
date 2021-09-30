import { BaseError } from '@errors/base.error';
import { getPagination } from '@utils/controllers.utils';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { updateRepository } from '../repositories/common.repository';
import { mongoIdValidation } from '../validations/common.validation';
import { GenericModel, ITag, ITagBothDocument } from '../interfaces/models.interface';
import { create, read, update } from '../services/crud.service';

export const CreateTag =
	<Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
		model: M,
		validate: Joi.ObjectSchema<Partial<ITag>>
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { body } = req;
			const name: string = body.name;
			await mongoIdValidation.validateAsync(body.relatedTag);
			const tag = (await create<Doc>(model, validate, {
				name,
				parent: body.relatedTag
			})) as unknown as ITagBothDocument;
			if (body.relatedTag) {
				const relatedTag = (
					await read<Doc>(model, { _id: body.relatedTag }, getPagination())
				)[0] as unknown as ITagBothDocument;

				if (relatedTag) {
					relatedTag.relatedTags.push(tag._id);
					relatedTag.save();
				}
			}
			res.sendStatus(201);
		} catch (err) {
			next(err);
		}
	};

export const UpdateTag =
	<Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
		model: M,
		validate: Joi.ObjectSchema<Partial<ITag>>
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { body, params } = req;
			const name: string = body.name;
			await mongoIdValidation.validateAsync(body.relatedTag);
			const tag = (await update<Doc>(
				model,
				validate,
				{ _id: params.id_tag },
				{ name }
			)) as unknown as ITagBothDocument;

			if (body.relatedTag) {
				if (tag.relatedTags.length > 0) {
					throw new BaseError('Tag with inheritance.', 409);
				}
				await updateRepository<ITagBothDocument>(
					model as unknown as GenericModel<ITagBothDocument>,
					{ relatedTags: { $in: [tag._id] } },
					{ $pull: { relatedTags: tag._id } }
				);
				const relatedTag = (
					await read<Doc>(model, { _id: body.relatedTag }, getPagination())
				)[0] as unknown as ITagBothDocument;

				if (relatedTag) {
					relatedTag.relatedTags.push(tag._id);
					await relatedTag.save();
				}
			}
			res.sendStatus(200);
		} catch (err) {
			next(err);
		}
	};
