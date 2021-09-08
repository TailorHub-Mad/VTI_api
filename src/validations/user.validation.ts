import Joi from 'joi';
import { mongoIdValidation } from './common.validation';

export const newUserValidation = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().required(), // TODO: Create regExp
	alias: Joi.string().required(),
	department: mongoIdValidation.required()
});

export const loginUserValidation = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().required() // TODO: Create regExp
});
