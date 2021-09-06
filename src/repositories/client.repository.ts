import { createSet } from '@utils/model.utils';
import { UpdateQuery } from 'mongoose';
import { IClientDocument } from '../interfaces/models.interface';
import { ClientModel } from '../models/client.model';

export const createModelsInClientRepository = async (
	field: 'testSystem' | 'projects',
	find_id: string,
	body: UpdateQuery<IClientDocument>
): Promise<IClientDocument | undefined> => {
	const client = await ClientModel.findOneAndUpdate({ _id: find_id }, { $push: { [field]: body } });
	return client?.save();
};

export const updateModelsInClientRepository = async (
	field: 'testSystem' | 'projects',
	find_id: string,
	body: UpdateQuery<IClientDocument>
): Promise<IClientDocument | null> => {
	const update = createSet(body, `${field}.$`);
	return await ClientModel.findOneAndUpdate({ [`${field}._id`]: find_id }, update);
};

export const deleteModelInClientRepository = async (
	field: 'testSystem' | 'projects',
	find_id: string
): Promise<IClientDocument | null> => {
	return await ClientModel.findOneAndUpdate(
		{ [`${field}._id`]: find_id },
		{ $pull: { [field]: { _id: find_id } } }
	);
};
