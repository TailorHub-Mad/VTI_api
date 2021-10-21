import Joi from 'joi';

export const createVtiCodeValidation = Joi.object().keys({
	name: Joi.string().required()
});

export const filterVtiCodeValidation = Joi.object().keys({
	ref: Joi.string(),
	name: Joi.string()
});
