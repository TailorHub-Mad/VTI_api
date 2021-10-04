import Joi from 'joi';

export const createSectorValidation = Joi.array()
	.items(
		Joi.object({
			title: Joi.string().required()
		}).required()
	)
	.required();

export const updateSectorValidation = Joi.object().keys({ title: Joi.string() });

export const updateSectorProjectValidation = Joi.object()
	.keys({
		projects: Joi.string().required()
	})
	.required();

export const filterSectorValidation = Joi.object().keys({
	ref: Joi.string(),
	title: Joi.string()
});
