import { formatFilter } from '@utils/client.utils';
import { Pagination } from '../interfaces/config.interface';
import { findWithPagination } from '../repositories/common.repository';
import { GenericModel, IClientDocument } from '../interfaces/models.interface';
import Joi from 'joi';
import { PopulateOptions } from 'mongoose';
import { purgeObj } from '@utils/index';
import { OrderAggregate } from '@utils/order.utils';

export const filterClient = async <Doc, M extends GenericModel<Doc>>(
	model: M,
	validate: Joi.ObjectSchema<Partial<Doc>> | Joi.ArraySchema,
	filter: Partial<IClientDocument>,
	pagiantion: Pagination,
	populate?: PopulateOptions
): Promise<Doc[]> => {
	const validateFilter = await validate.validateAsync(filter);
	const clients = await findWithPagination<Doc>(model, formatFilter(validateFilter), pagiantion, {
		populate,
		order: purgeObj(
			Object.assign({}, new OrderAggregate(filter as { [key: string]: 'asc' | 'desc' }))
		)
	});
	return clients;
};
