import { Types } from 'mongoose';

export const transformStringToObjectId = (id: string): Types.ObjectId => {
	return Types.ObjectId(id);
};

export const createSet = (
	body: { [key: string]: unknown },
	field: string
): {
	[key: string]: unknown;
} => {
	return Object.entries(body).reduce((set, [property, value]) => {
		set[`${field}.${property}`] = value;
		return set;
	}, {} as { [key: string]: unknown });
};
