import { FilterQuery } from 'mongoose';
import { aggregateCrud } from '../repositories/aggregate.repository';
import { Pagination } from '../interfaces/config.interface';
import { createRepository, findWithPagination } from '../repositories/common.repository';
import Joi from 'joi';
import { GenericModel } from 'src/interfaces/models.interface';

export const getAll = async <Doc, M extends GenericModel<Doc>>(
	model: M,
	pagination: Pagination
): Promise<Doc[]> => {
	return await findWithPagination(model, {}, pagination);
};

export const find = async <Doc, M extends GenericModel<Doc>>(
	model: M,
	query: FilterQuery<Doc>,
	pagination: Pagination
): Promise<Doc[]> => {
	return await findWithPagination<Doc>(model, query, pagination);
};

export const create = async <Doc, M extends GenericModel<Doc>>(
	model: M,
	validate: Joi.ObjectSchema<Doc>,
	body: Partial<Doc>
): Promise<Doc> => {
	const newinfo = await validate.validateAsync(body);
	return await createRepository<Doc>(model, newinfo);
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
