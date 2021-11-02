import { GROUP_NOTES } from '@constants/group.constans';
import Joi from 'joi';
import { mongoIdValidation } from './common.validation';

export const createNoteValidation = Joi.object().keys({
	title: Joi.string().required(),
	description: Joi.string().required(),
	link: Joi.string(),
	project: mongoIdValidation.required(),
	testSystems: Joi.array().items(mongoIdValidation),
	tags: Joi.array().items(mongoIdValidation),
	documents: Joi.array().items(
		Joi.object({
			_id: mongoIdValidation,
			url: Joi.string().required(),
			name: Joi.string().required()
		})
	)
});

export const updateNoteValidationAdmin = Joi.object().keys({
	title: Joi.string(),
	description: Joi.string(),
	link: Joi.string(),
	isClosed: Joi.boolean(),
	formalized: Joi.boolean(),
	tags: Joi.array().items(mongoIdValidation),
	testSystems: Joi.array().items(mongoIdValidation),
	documents: Joi.array().items(
		Joi.object({
			_id: mongoIdValidation,
			url: Joi.string().required(),
			name: Joi.string().required()
		})
	)
});

export const createMessageNoteValidation = Joi.object().keys({
	message: Joi.string().required(),
	link: Joi.string(),
	documents: Joi.array().items(
		Joi.object({
			_id: mongoIdValidation,
			url: Joi.string().required(),
			name: Joi.string().required()
		})
	)
});

export const updateMessageNoteValidation = Joi.object().keys({
	message: Joi.string(),
	formalized: Joi.boolean(),
	link: Joi.string(),
	approved: Joi.boolean(),
	documents: Joi.array().items(
		Joi.object({
			url: Joi.string().required(),
			_id: mongoIdValidation,
			name: Joi.string().required()
		})
	)
});

export const groupNotesValidation = Joi.object().keys({
	group: Joi.string().valid(...GROUP_NOTES),
	real: Joi.boolean()
});
