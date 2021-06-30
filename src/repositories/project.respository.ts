import { IClientDocument } from '../interfaces/models.interface';
import { ClientModel } from '../models/client.model';

export const checkAlias = async (alias: string): Promise<IClientDocument | null> => {
	const client = await ClientModel.findOne({ 'projects.alias': alias });
	return client;
};
