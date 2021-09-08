import Joi from 'joi';

export const createDepartmentValidation = Joi.array().items(
	Joi.object({
		name: Joi.string().required()
	})
);

export const updateDepartmentValidation = Joi.object().keys({
	name: Joi.string()
});
