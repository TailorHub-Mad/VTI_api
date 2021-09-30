import Joi from 'joi';

export const createTagValidation = Joi.object().keys({
	name: Joi.string().required(),
	parent: Joi.string().required()
});

export const updateTagValidation = Joi.object().keys({
	name: Joi.string(),
	parent: Joi.string().required()
});
