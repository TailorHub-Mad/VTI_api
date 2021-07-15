import { FilterQuery, Types, UpdateQuery } from 'mongoose';
import { aggregateCrud } from '../repositories/aggregate.repository';
import { Pagination } from '../interfaces/config.interface';
import {
	createRepository,
	findWithPagination,
	updateRepository
} from '../repositories/common.repository';
import Joi from 'joi';
import { GenericModel } from '../interfaces/models.interface';
import QueryString from 'qs';

export const getAll = async <Doc, M extends GenericModel<Doc>>(
	model: M,
	pagination: Pagination
): Promise<Doc[] | []> => {
	return await findWithPagination(model, {}, pagination);
};

export const read = async <Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
	model: M,
	query: FilterQuery<Document>,
	pagination: Pagination,
	select?: string
): Promise<Doc[]> => {
	return await findWithPagination<Doc>(model, query, pagination, select);
};

export const create = async <Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
	model: M,
	validate: Joi.ObjectSchema<Doc>,
	body: Partial<unknown>
): Promise<Doc> => {
	const newInfo = await validate.validateAsync(body);
	return await createRepository<Doc>(model, newInfo);
};

export const update = async <Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
	model: M,
	validate: Joi.ObjectSchema<Partial<Doc>>,
	query: FilterQuery<Document>,
	body: UpdateQuery<unknown>
): Promise<Doc | null> => {
	const updateInfo = await validate.validateAsync(body);
	Object.keys(updateInfo).forEach((key) => updateInfo[key] === undefined && delete updateInfo[key]);
	return await updateRepository<Doc>(model, query, updateInfo);
};

export const getAllAggregate = async (
	pagination: Pagination,
	_extends?: string,
	order?: { [key: string]: -1 | 1 }
): Promise<unknown> => {
	const transformExtendsToArray = _extends?.split('.');
	const nameField = transformExtendsToArray?.slice(-1)[0];
	return await aggregateCrud(
		{ _extends, nameFild: nameField, querys: {}, group: 'null' },
		pagination,
		order
	);
};

export const getByIdAggregate = async (id: string, _extends?: string): Promise<unknown> => {
	const transformExtendsToArray = _extends?.split('.');
	const nameField = transformExtendsToArray?.slice(-1)[0];
	return await aggregateCrud({
		_extends,
		nameFild: nameField,
		querys: { [`${nameField}._id`]: Types.ObjectId(id) }
	});
};

export const getByQueryAggregate = async (
	query: QueryString.ParsedQs,
	pagination: Pagination,
	_extends?: string
): Promise<unknown> => {
	const transformExtendsToArray = _extends?.split('.');
	const nameField = transformExtendsToArray?.slice(-1)[0];
	return await aggregateCrud(
		{
			_extends,
			nameFild: nameField,
			querys: query
		},
		pagination
	);
};
