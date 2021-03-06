import { GROUP_PROJECT } from '@constants/group.constans';
import Joi from 'joi';
import { mongoIdValidation } from './common.validation';

export const createProjectValidation = Joi.object().keys({
	alias: Joi.string().required(),
	client: Joi.string().required(),
	sector: mongoIdValidation,
	date: Joi.object()
		.keys({
			year: Joi.string().length(4).required(),
			month: Joi.string(),
			day: Joi.string()
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
		year: Joi.string().length(4),
		month: Joi.string(),
		day: Joi.string()
	}),
	focusPoint: mongoIdValidation,
	testSystems: Joi.array().items(mongoIdValidation),
	tags: Joi.array().items(mongoIdValidation),
	closed: Joi.object().keys({
		year: Joi.string().length(4),
		month: Joi.string(),
		day: Joi.string()
	})
});

export const orderProjectValidation = Joi.object().keys({
	group: Joi.string().valid(...GROUP_PROJECT),
	real: Joi.boolean()
});
