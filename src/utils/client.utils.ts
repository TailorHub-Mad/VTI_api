import { IClientDocument } from '../interfaces/models.interface';
import { FilterQuery, Types } from 'mongoose';

export const formatFilter = <Doc>(
	clientData: Partial<IClientDocument & { union: string; 'department._id': string }>
): FilterQuery<Doc> => {
	const union = (clientData as { union: string }).union ? '$and' : '$or';
	delete clientData.union;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const filter: any = { [union]: [] };
	if (clientData['department._id']) {
		filter[union]?.push({
			department: clientData['department._id']
		});
		delete clientData['department._id'];
	}
	Object.entries(clientData).forEach(([key, value]) => {
		const push = Array.isArray(value)
			? key === 'focusPoint' || key === 'projectsComments'
				? {
						[key]: { $in: value }
				  }
				: {
						$or: value.map((v) => ({
							[key]: key.includes('department')
								? Types.ObjectId(v as string)
								: { $regex: v, $options: 'i' }
						}))
				  }
			: key === 'focusPoint' || key === 'projectsComments'
			? {
					[key]: { $in: [value] }
			  }
			: {
					[key]: key.includes('department')
						? Types.ObjectId(value as string)
						: { $regex: value, $options: 'i' }
			  };
		filter[union]?.push(push);
	});
	console.log(JSON.stringify(filter));
	return filter;
};
