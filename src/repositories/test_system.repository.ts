import { IClientDocument } from '../interfaces/models.interface';
import { ClientModel } from '../models/client.model';

export const checkVtiCode = async (vtiCode: string): Promise<IClientDocument | null> => {
	const client = await ClientModel.findOne({ 'testSystem.vtiCode': vtiCode });
	return client;
};