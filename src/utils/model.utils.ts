import { Types } from 'mongoose';

export const transformStringToObjectId = (id: string): Types.ObjectId => {
	return Types.ObjectId(id);
};
