import { TYPES_FILTER } from '@constants/filter.constants';
import Joi from 'joi';

export const createFilterValidation = Joi.object().keys({
	name: Joi.string().required(),
	type: Joi.string().valid(...TYPES_FILTER),
	query: Joi.string().required(),
	public: Joi.boolean()
});
