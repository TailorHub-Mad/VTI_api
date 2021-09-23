import { formatFilter } from '@utils/client.utils';
import { Pagination } from 'src/interfaces/config.interface';
import { ClientModel } from 'src/models/client.model';
import { findWithPagination } from 'src/repositories/common.repository';
import { IClientDocument } from '../interfaces/models.interface';
import { FilterClientValidation } from '../validations/client.validation';

export const filterClient = async (
	filter: Partial<IClientDocument>,
	pagiantion: Pagination
): Promise<IClientDocument[]> => {
	const validateFilter = await FilterClientValidation.validateAsync(filter);
	const clients = await findWithPagination<IClientDocument>(
		ClientModel,
		formatFilter(validateFilter),
		pagiantion
	);
	return clients;
};
