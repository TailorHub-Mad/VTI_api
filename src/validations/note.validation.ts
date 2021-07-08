import { GROUP_NOTES } from '@constants/group.constans';
import Joi from 'joi';
import { mongoIdValidation } from './common.validation';

export const createNoteValidation = Joi.object().keys({
	title: Joi.string().required(),
	description: Joi.string().required(),
	link: Joi.string(),
	project: mongoIdValidation.required(),
	testSystems: Joi.array().items(mongoIdValidation),
	tags: Joi.array().items(mongoIdValidation)
});

export const updateNoteValidationAdmin = Joi.object().keys({
	title: Joi.string(),
	description: Joi.string(),
	link: Joi.string(),
	approved: Joi.boolean(),
	formalized: Joi.boolean()
});

export const createMessageNoteValidation = Joi.object().keys({
	message: Joi.string().required()
});

export const updateMessageNoteValidation = Joi.object().keys({
	message: Joi.string(),
	formalized: Joi.boolean(),
	approved: Joi.boolean()
});

export const groupNotesValidation = Joi.object().keys({
	group: Joi.string().valid(...GROUP_NOTES),
	real: Joi.boolean()
});
