import Joi from 'joi';

export const newUserValidation = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().required(), // TODO: Create regExp
	alias: Joi.string().required()
});

export const loginUserValidation = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().required() // TODO: Create regExp
});
