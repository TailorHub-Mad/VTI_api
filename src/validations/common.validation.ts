import { BaseError } from '@errors/base.error';
import Joi from 'joi';
import { isValidObjectId, Types } from 'mongoose';

export const mongoIdValidation = Joi.string().external((value) => {
	if (!value || (isValidObjectId(value) && String(new Types.ObjectId(value)) === value)) {
		return value;
	} else {
		throw new BaseError(`value "invalid" at path "_id": ${value}`, 400);
	}
});
