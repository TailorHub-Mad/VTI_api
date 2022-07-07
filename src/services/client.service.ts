import { formatFilter } from '@utils/client.utils';
import { Pagination } from '../interfaces/config.interface';
import {
	deleteRepository,
	findOneRepository,
	findWithPagination
} from '../repositories/common.repository';
import { GenericModel, IClientDocument } from '../interfaces/models.interface';
import Joi from 'joi';
import { PopulateOptions } from 'mongoose';
import { purgeObj } from '@utils/index';
import { OrderAggregate } from '@utils/order.utils';
import { ClientModel } from '../models/client.model';
import { BaseError } from '@errors/base.error';

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

export const deleteClient = async (id: string) => {
	const client = await findOneRepository<IClientDocument>(ClientModel, { _id: id });
	if (!client) {
		throw new BaseError('Not found client', 404);
	}
	if (client.testSystems.length > 0) {
		throw new BaseError('This customer has associated test systems', 400);
	}
	await deleteRepository<IClientDocument>(ClientModel, { _id: id });
};
