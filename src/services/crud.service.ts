import { Model } from 'mongoose';
import { aggregateCrud } from '../repositories/aggregate.repository';
import { Pagination } from '../interfaces/config.interface';
import { createRepository, findWithPagination } from '../repositories/common.repository';
import Joi from 'joi';

export const getAll = async <T>(model: Model<T>, pagination: Pagination): Promise<T[]> => {
	return await findWithPagination(model, {}, pagination);
};

export const create = async <Doc, M extends Model<Doc, any, any> = Model<any, any, any>>(
	model: M,
	validate: Joi.ObjectSchema<Doc>,
	body: Partial<Doc>
): Promise<Doc> => {
	const newinfo = await validate.validateAsync(body);
	return await createRepository<Doc, M>(model, newinfo);
};

export const getAllAggregate = async (
	pagination: Pagination,
	_extends?: string
): Promise<unknown> => {
	const transformExtendsToArray = _extends?.split('.');
	const nameField = transformExtendsToArray?.slice(-1)[0];
	return await aggregateCrud(
		{ _extends, nameFild: nameField, querys: {}, group: 'null' },
		pagination
	);
};
