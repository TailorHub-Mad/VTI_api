import { FilterQuery, PopulateOptions, Types, UpdateQuery } from 'mongoose';
import { aggregateCrud } from '../repositories/aggregate.repository';
import { Pagination } from '../interfaces/config.interface';
import {
	createRepository,
	deleteRepository,
	findWithPagination,
	updateRepository
} from '../repositories/common.repository';
import Joi from 'joi';
import { GenericModel } from '../interfaces/models.interface';
import QueryString from 'qs';

export const getAll = async <Doc, M extends GenericModel<Doc>>(
	model: M,
	pagination: Pagination,
	populate?: PopulateOptions
): Promise<Doc[] | []> => {
	return await findWithPagination(model, {}, pagination, { populate });
};

export const read = async <Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
	model: M,
	query: FilterQuery<Document>,
	pagination: Pagination,
	options?: { select?: string; populate?: PopulateOptions }
): Promise<Doc[]> => {
	return await findWithPagination<Doc>(model, query, pagination, options);
};

export const create = async <Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
	model: M,
	validate: Joi.ObjectSchema<Doc> | Joi.ArraySchema,
	body: Partial<unknown>
): Promise<Doc | Doc[]> => {
	const newInfo = await validate.validateAsync(body);
	if (Array.isArray(newInfo)) {
		return await Promise.all(newInfo.map((document) => createRepository<Doc>(model, document)));
	}
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

export const deleteCrud = async <Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
	model: M,
	filter: FilterQuery<Document>
): Promise<Doc | null> => {
	return await deleteRepository<Doc>(model, filter);
};

export const getAllAggregate = async (
	pagination: Pagination,
	_extends?: string,
	order?: { [key: string]: -1 | 1 },
	populates?: string[]
): Promise<unknown> => {
	const transformExtendsToArray = _extends?.split('.');
	const nameField = transformExtendsToArray?.slice(-1)[0];
	return await aggregateCrud(
		{ _extends, nameFild: nameField, querys: {}, group: 'null', populates },
		pagination,
		order
	);
};

export const getByIdAggregate = async (
	id: string,
	_extends?: string,
	populates?: string[]
): Promise<unknown> => {
	const transformExtendsToArray = _extends?.split('.');
	const nameField = transformExtendsToArray?.slice(-1)[0];
	return await aggregateCrud({
		_extends,
		nameFild: nameField,
		querys: { [`${nameField}._id`]: Types.ObjectId(id) },
		populates
	});
};

export const getByQueryAggregate = async (
	query: QueryString.ParsedQs,
	pagination: Pagination,
	_extends?: string,
	populates?: string[]
): Promise<unknown> => {
	const transformExtendsToArray = _extends?.split('.');
	const nameField = transformExtendsToArray?.slice(-1)[0];

	const transformQueryToArray = Object.entries(query).map(([key, value]) => {
		if (Array.isArray(value)) {
			return {
				$and: value.map((v) => ({
					[key]: key.includes('_id')
						? Types.ObjectId(v as string)
						: v === 'true'
						? true
						: { $regex: v, $options: 'i' }
				}))
			};
		}
		return {
			[key]:
				key.includes('_id') || key.includes('clientId')
					? Types.ObjectId(value as string)
					: value === 'true'
					? true
					: { $regex: value, $options: 'i' }
		};
	});
	const transformQuery =
		transformQueryToArray.length > 0
			? {
					$or: transformQueryToArray
			  }
			: {};
	return await aggregateCrud(
		{
			_extends,
			nameFild: nameField,
			querys: transformQuery,
			populates
		},
		pagination
	);
};
