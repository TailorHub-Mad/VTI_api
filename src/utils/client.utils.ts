import { IformatFilter } from '../interfaces/utils.interfece';
import { IClientDocument } from '../interfaces/models.interface';

export const formatFilter = (clientData: Partial<IClientDocument>): IformatFilter => {
	const filter: IformatFilter = { $or: [] };
	Object.entries(clientData).forEach(([key, value]) => {
		filter.$or.push({ [key]: value });
	});
	return filter;
};
