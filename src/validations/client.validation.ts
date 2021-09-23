import Joi from 'joi';

export const newClientValidation = Joi.array()
	.items(
		Joi.object({
			alias: Joi.string().required(),
			name: Joi.string().required()
		})
	)
	.required();

export const updateClientValidation = Joi.object().keys({
	alias: Joi.string(),
	name: Joi.string()
});

export const FilterClientValidation = Joi.object().keys({
	alias: Joi.string(),
	name: Joi.string(),
	_id: Joi.string(),
	ref: Joi.string()
});
