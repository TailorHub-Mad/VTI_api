import { Model } from 'mongoose';
import { Pagination } from '../interfaces/config.interface';
import { findWithPagination } from '../repositories/common.repository';

export const getAll = async <T>(model: Model<T>, pagination: Pagination): Promise<T[]> => {
	return await findWithPagination(model, {}, pagination);
};
