import Joi from 'joi';

export const createVtiCodeValidation = Joi.object().keys({
	name: Joi.string().required()
});
