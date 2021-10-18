import Joi from 'joi';
import { mongoIdValidation } from './common.validation';

export const filterCriterionValidation = Joi.object().keys({
	type: Joi.string().valid('note', 'project'),
	name: Joi.string(),
	title: Joi.string
});

export const createGroupValidation = Joi.object().keys({
	relatedTags: Joi.array().items(mongoIdValidation),
	name: Joi.string().required(),
	_id: Joi.string()
});

export const CriterionCreateValidation = Joi.object().keys({
	title: Joi.string().required(),
	group: Joi.array().items(createGroupValidation)
});

export const CriterionUpdateValidation = Joi.object().keys({
	title: Joi.string(),
	group: Joi.array().items(createGroupValidation)
});
