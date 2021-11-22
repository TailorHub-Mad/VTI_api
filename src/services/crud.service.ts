import { FilterQuery, PopulateOptions, Types, UpdateQuery } from 'mongoose';
import { aggregateCrud } from '../repositories/aggregate.repository';
import { Pagination } from '../interfaces/config.interface';
import {
	createRepository,
	deleteRepository,
	findOneRepository,
	findWithPagination,
	updateRepository
} from '../repositories/common.repository';
import Joi from 'joi';
import { GenericModel, IReqUser, IUserDocument } from '../interfaces/models.interface';
import QueryString from 'qs';
import { UserModel } from '../models/user.model';
import { purgeObj } from '@utils/index';
import { OrderAggregate } from '@utils/order.utils';
import { ClientModel } from '../models/client.model';

export const getAll = async <Doc, M extends GenericModel<Doc>>(
	model: M,
	pagination: Pagination,
	options?: { populate?: PopulateOptions; order?: { [key: string]: 1 | -1 } }
): Promise<Doc[] | []> => {
	return await findWithPagination(model, {}, pagination, options);
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
	populates?: string[],
	reqUser?: IReqUser
): Promise<unknown> => {
	const transformExtendsToArray = _extends?.split('.');
	const nameField = transformExtendsToArray?.slice(-1)[0];
	return await aggregateCrud(
		{ _extends, nameFild: nameField, querys: {}, group: 'null', populates },
		pagination,
		order,
		reqUser
	);
};

export const getByIdAggregate = async (
	id: string,
	_extends?: string,
	populates?: string[],
	reqUser?: IReqUser
): Promise<unknown> => {
	const transformExtendsToArray = _extends?.split('.');
	const nameField = transformExtendsToArray?.slice(-1)[0];
	return await aggregateCrud(
		{
			_extends,
			nameFild: nameField,
			querys: { [`${nameField}._id`]: Types.ObjectId(id) },
			populates
		},
		undefined,
		undefined,
		reqUser
	);
};

export const getByQueryAggregate = async (
	query: QueryString.ParsedQs,
	pagination: Pagination,
	_extends?: string,
	populates?: string[],
	reqUser?: IReqUser
): Promise<unknown> => {
	const transformExtendsToArray = _extends?.split('.');
	const nameField = transformExtendsToArray?.slice(-1)[0];
	const aux = [];
	const union = query.union ? '$and' : '$or';
	delete query.union;

	const order = purgeObj(
		Object.assign({}, new OrderAggregate(query as { [key: string]: 'asc' | 'desc' }))
	);
	Object.entries(query).forEach(([key, value]) => {
		if (value === 'asc' || value === 'des') {
			delete query[key];
		}
	});

	if (query['notes.ref'] && query['notes.title']) {
		aux.push({
			$or: [
				{ 'notes.ref': { $regex: query['notes.ref'], $options: 'i' } },
				{ 'notes.title': { $regex: query['notes.title'], $options: 'i' } }
			]
		});
		delete query['notes.ref'];
		delete query['notes.title'];
	}
	if (query['projects.ref'] && query['projects.alias']) {
		aux.push({
			$or: [
				{ 'projects.ref': { $regex: query['projects.ref'], $options: 'i' } },
				{ 'projects.alias': { $regex: query['projects.alias'], $options: 'i' } }
			]
		});
		delete query['projects.ref'];
		delete query['projects.alias'];
	}

	if ((query.subscribed || query.favorites || query.noRead) && reqUser) {
		const user = await findOneRepository<IUserDocument>(UserModel, { _id: reqUser.id });
		if (user) {
			if (query.subscribed) {
				delete query.subscribed;
				if (
					user.subscribed.notes.length > 0 ||
					user.subscribed.projects.length > 0 ||
					user.subscribed.testSystems.length > 0
				) {
					const [projectNotesSubcribed] = await ClientModel.aggregate([
						{
							$unwind: {
								path: '$projects'
							}
						},
						{
							$match: {
								'projects._id': {
									$in: user.subscribed.projects.map((project) => Types.ObjectId(project))
								}
							}
						},
						{
							$project: {
								notes: '$projects.notes'
							}
						},
						{
							$unwind: {
								path: '$notes'
							}
						},
						{
							$group: {
								_id: null,
								notes: {
									$push: '$notes'
								}
							}
						}
					]);
					const [testSystemsNotesSubcribed] = await ClientModel.aggregate([
						{
							$unwind: {
								path: '$testSystems'
							}
						},
						{
							$match: {
								'testSystems._id': {
									$in: user.subscribed.testSystems.map((testSystems) => Types.ObjectId(testSystems))
								}
							}
						},
						{
							$project: {
								notes: '$testSystems.notes'
							}
						},
						{
							$unwind: {
								path: '$notes'
							}
						},
						{
							$group: {
								_id: null,
								notes: {
									$push: '$notes'
								}
							}
						}
					]);
					aux.push({
						$or: (user.subscribed.notes || [])
							.concat(projectNotesSubcribed?.notes || [], testSystemsNotesSubcribed?.notes || [])
							.map((note) => ({ 'notes._id': Types.ObjectId(note) }))
					});
				} else {
					return [];
				}
			}
			if (query.favorites) {
				delete query.favorites;
				if (user.favorites.notes.length > 0) {
					aux.push({
						$or: user.favorites.notes.map((note) => ({ 'notes._id': Types.ObjectId(note) }))
					});
				} else {
					return [];
				}
			}
			if (query.noRead) {
				delete query.noRead;
				aux.push({ 'notes.readBy': { $ne: Types.ObjectId(user._id) } });
			}
		}
	}
	const transformQueryToArray = [
		...Object.entries(query)
			.map(([key, value]) => {
				if (key?.includes('_') && !key?.includes('_id')) {
					return undefined;
				}
				if (Array.isArray(value)) {
					if (key.match(/\.createdAt$/)) {
						return {
							$or: value.map((t) => {
								const time = (t as string).split(';');
								return {
									$and: [
										{
											[key]: { $gte: new Date(time[0]) }
										},
										{
											[key]: { $lte: new Date(time[1]) }
										}
									]
								};
							})
						};
					}
					return {
						$or: value.map((v) => ({
							[key]:
								key.includes('_id') ||
								key.includes('tags') ||
								(key.includes('vtiCode') && _extends !== 'testSystems') ||
								key.includes('sector')
									? Types.ObjectId(v as string)
									: v === 'true' || v === 'false'
									? v === 'true'
									: { $regex: v, $options: 'i' }
						}))
					};
				} else if (key.match(/\.createdAt$/)) {
					const time = (value as string).split(';');
					return {
						$and: [
							{
								[key]: { $gte: new Date(time[0]) }
							},
							{
								[key]: { $lte: new Date(time[1]) }
							}
						]
					};
				}
				return {
					[key]:
						key.includes('_id') ||
						key.includes('clientId') ||
						key.includes('tags') ||
						(key.includes('vtiCode') && _extends !== 'testSystems') ||
						key.includes('sector')
							? Types.ObjectId(value as string)
							: value === 'true' || value === 'false'
							? value === 'true'
							: { $regex: value, $options: 'i' }
				};
			})
			.filter((match) => match),
		...aux
	];
	const transformQuery =
		transformQueryToArray.length > 0
			? {
					[union]: transformQueryToArray
			  }
			: {};

	return await aggregateCrud(
		{
			_extends,
			nameFild: nameField,
			querys: transformQuery,
			populates
		},
		pagination,
		order,
		reqUser
	);
};
