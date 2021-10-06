import { IClientDocument } from '../interfaces/models.interface';
import { FilterQuery, Types } from 'mongoose';

export const formatFilter = <Doc>(clientData: Partial<IClientDocument>): FilterQuery<Doc> => {
	const filter: any = { $or: [] };
	Object.entries(clientData).forEach(([key, value]) => {
		const push = Array.isArray(value)
			? {
					[key]: value.map((v) => ({
						[key]: key.includes('_id') ? Types.ObjectId(v as string) : { $regex: v, $options: 'i' }
					}))
			  }
			: {
					[key]: key.includes('_id')
						? Types.ObjectId(value as string)
						: { $regex: value, $options: 'i' }
			  };
		filter.$or?.push(push);
	});
	return filter;
};
