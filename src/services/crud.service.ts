import { Model } from 'mongoose';
import { aggregateCrud } from '../repositories/aggregate.repository';
import { Pagination } from '../interfaces/config.interface';
import { findWithPagination } from '../repositories/common.repository';

export const getAll = async <T>(model: Model<T>, pagination: Pagination): Promise<T[]> => {
	return await findWithPagination(model, {}, pagination);
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
