import { BaseError } from '@errors/base.error';
import { getPagination } from '@utils/controllers.utils';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { updateRepository } from '../repositories/common.repository';
import { mongoIdValidation } from '../validations/common.validation';
import { GenericModel, ITag, ITagBothDocument } from '../interfaces/models.interface';
import { create, read, update } from '../services/crud.service';
import { createNotification, extendNotification } from '../services/notification.service';
import {
	NEW_TAG_NOTE,
	NEW_TAG_PROJECT,
	TAG_NOTE_NOTIFICATION,
	TAG_PROJECT_NOTIFICATION
} from '@constants/notification.constants';

export const CreateTag =
	<Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
		model: M,
		validate: Joi.ObjectSchema<Partial<ITag>>,
		type: 'note' | 'project'
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
			const tagNotification = type === 'note' ? TAG_NOTE_NOTIFICATION : TAG_PROJECT_NOTIFICATION;
			const typeNotification = type === 'note' ? NEW_TAG_NOTE : NEW_TAG_PROJECT;
			const notification = await createNotification(req.user, {
				description: `Se ha creado un nuevo tag: ${tagNotification.label}`,
				urls: [
					{
						label: body.name || tagNotification.label,
						model: tagNotification.model,
						id: tag._id
					}
				],
				type: typeNotification
			});
			await extendNotification({ field: tagNotification.model, id: tag._id }, notification, true);
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
				{ name, parent: body.relatedTag }
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
