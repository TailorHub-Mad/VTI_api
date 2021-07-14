import { GROUP_TEST_SYSTEM } from '@constants/group.constans';
import Joi from 'joi';
import { mongoIdValidation } from './common.validation';

export const createTestSystemValidation = Joi.object().keys({
	vtiCode: Joi.string().required(),
	alias: Joi.string().required(),
	date: Joi.object().keys({
		year: Joi.string()
	}),
	client: mongoIdValidation.required()
});

export const updateTestSystemValidation = Joi.object().keys({
	vtiCode: Joi.string(),
	alias: Joi.string(),
	date: Joi.object().keys({
		year: Joi.string()
	})
});

export const groupTestSystemValidation = Joi.object().keys({
	group: Joi.string().valid(...GROUP_TEST_SYSTEM),
	real: Joi.boolean()
});
