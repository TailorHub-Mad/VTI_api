import { IClientDocument } from '../interfaces/models.interface';
import { FilterQuery } from 'mongoose';

export const formatFilter = <Doc>(clientData: Partial<IClientDocument>): FilterQuery<Doc> => {
	const filter: any = { $or: [] };
	Object.entries(clientData).forEach(([key, value]) => {
		filter.$or?.push({ [key]: { $regex: value, $options: 'i' } });
	});
	return filter;
};
