import { EnforceDocument, FilterQuery, Model } from 'mongoose';
import { Pagination } from '../interfaces/config.interface';

// Este repository nos dejará buscar por cualquier modelo y nos devolvera con su interfece corresponiente.
export const findWithPagination = async <T>(
	model: Model<T>,
	find: FilterQuery<T>,
	pagination: Pagination
): Promise<EnforceDocument<T, unknown>[]> => {
	return await model.find(find).skip(pagination.offset).limit(pagination.limit);
};
