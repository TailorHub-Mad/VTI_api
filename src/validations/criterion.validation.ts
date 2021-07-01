import Joi from 'joi';
import { mongoIdValidation } from './common.validation';

export const CriterionCreateValidation = Joi.object().keys({
	name: Joi.string().required(),
	title: Joi.string().required(),
	relatedTags: Joi.array().items(mongoIdValidation)
});
