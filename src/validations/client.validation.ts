import Joi from 'joi';

export const newClientValidation = Joi.object().keys({
	alias: Joi.string().required(),
	name: Joi.string().required()
});
