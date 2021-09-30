import Joi from 'joi';
import { mongoIdValidation } from './common.validation';

export const newUserValidation = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().required(), // TODO: Create regExp
	alias: Joi.string().required(),
	name: Joi.string(),
	lastName: Joi.string(),
	department: mongoIdValidation.required()
});

export const loginUserValidation = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().required() // TODO: Create regExp
});

export const updateUserValidation = Joi.object().keys({
	alias: Joi.string(),
	name: Joi.string(),
	lastName: Joi.string(),
	department: mongoIdValidation.required()
});
