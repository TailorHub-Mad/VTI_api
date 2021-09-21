import { createSet } from '@utils/model.utils';
import { UpdateQuery } from 'mongoose';
import { IClientDocument } from '../interfaces/models.interface';
import { ClientModel } from '../models/client.model';

export const createModelsInClientRepository = async (
	field: 'testSystems' | 'projects',
	find_id: string,
	body: UpdateQuery<IClientDocument>
): Promise<IClientDocument | undefined> => {
	const client = await ClientModel.findOneAndUpdate(
		{ _id: find_id },
		{ $push: { [field]: body } },
		{ new: true }
	);
	return client?.save();
};

export const updateModelsInClientRepository = async (
	field: 'testSystems' | 'projects',
	find_id: string,
	body: UpdateQuery<IClientDocument>,
	disabledSet = false
): Promise<IClientDocument | null> => {
	const update = disabledSet ? body : createSet(body, `${field}.$`);
	return await ClientModel.findOneAndUpdate({ [`${field}._id`]: find_id }, update);
};

export const deleteModelInClientRepository = async (
	field: 'testSystems' | 'projects',
	find_id: string
): Promise<IClientDocument | null> => {
	return await ClientModel.findOneAndUpdate(
		{ [`${field}._id`]: find_id },
		{ $pull: { [field]: { _id: find_id } } }
	);
};

export const findLastField = async <T>(field: 'testSystems' | 'projects' | 'notes'): Promise<T> => {
	const aggregate = await ClientModel.aggregate([
		{
			$project: {
				[field]: 1
			}
		},
		{
			$unwind: {
				path: `$${field}`
			}
		},
		{
			$sort: {
				[`${field}.createdAt`]: -1
			}
		},
		{
			$limit: 1
		}
	]);
	const [{ [field]: lastField }] = aggregate.length ? aggregate : [{ [field]: { ref: '' } }];
	return lastField;
};
