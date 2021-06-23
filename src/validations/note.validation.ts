import Joi from 'joi';
import { mongoIdValidation } from './common.validation';

export const createNoteValidation = Joi.object().keys({
	title: Joi.string().required(),
	description: Joi.string().required(),
	link: Joi.string(),
	project: mongoIdValidation.required(),
	testSystems: Joi.array().items(mongoIdValidation)
});
