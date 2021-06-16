import { Model } from 'mongoose';
import { findTestSystem } from '../repositories/client.repository';
import { Pagination } from '../interfaces/config.interface';
import { findWithPagination } from '../repositories/common.repository';

export const getAll = async <T>(model: Model<T>, pagination: Pagination): Promise<T[]> => {
	return await findWithPagination(model, {}, pagination);
};

export const getAllAggregate = async (
	_extends: string,
	pagination: Pagination
): Promise<unknown> => {
	const transformExtendsToArray = _extends.split('.');
	const nameField = transformExtendsToArray.slice(-1)[0];
	return await findTestSystem(
		{ _extends, nameFild: nameField, querys: {}, group: 'null' },
		pagination
	);
};
