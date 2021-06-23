import Joi from 'joi';

export const newClientValidation = Joi.object().keys({
	alias: Joi.string().required(),
	name: Joi.string().required()
});

export const updateClientValidation = Joi.object().keys({
	alias: Joi.string(),
	name: Joi.string()
});
