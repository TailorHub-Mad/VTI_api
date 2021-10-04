import Joi from 'joi';

export const createDepartmentValidation = Joi.array().items(
	Joi.object({
		name: Joi.string().required()
	})
);

export const updateDepartmentValidation = Joi.object().keys({
	name: Joi.string()
});

export const filterDepartmentvalidation = Joi.object().keys({
	title: Joi.string(),
	ref: Joi.string(),
	name: Joi.string()
});
