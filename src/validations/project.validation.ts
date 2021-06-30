import Joi from 'joi';
import { mongoIdValidation } from './common.validation';

export const createProjectValidation = Joi.object().keys({
	alias: Joi.string().required(),
	client: Joi.string().required(),
	sector: mongoIdValidation,
	date: Joi.object()
		.keys({
			year: Joi.string().required()
		})
		.required(),
	focusPoint: mongoIdValidation.required(),
	testSystems: Joi.array().items(mongoIdValidation),
	tags: Joi.array().items(mongoIdValidation)
});

export const updateProjectValidation = Joi.object().keys({
	alias: Joi.string(),
	client: Joi.string(),
	sector: mongoIdValidation,
	date: Joi.object().keys({
		year: Joi.string()
	}),
	focusPoint: mongoIdValidation,
	testSystems: Joi.array().items(mongoIdValidation),
	tags: Joi.array().items(mongoIdValidation)
});
