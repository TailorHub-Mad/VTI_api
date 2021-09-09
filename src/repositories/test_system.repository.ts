import { ClientModel } from '../models/client.model';

export const checkVtiCode = async (
	vtiCode: string,
	{ id_client, id_testSystem }: { id_client?: string; id_testSystem?: string }
): Promise<boolean | undefined> => {
	const client = await ClientModel.findOne({ 'testSystems.vtiCode': vtiCode });
	if (!client) return false;
	if (id_client) {
		return id_client === client._id.toString();
	}
	if (id_testSystem) {
		const testSystem = client.testSystems.find(
			(testSystem) => testSystem._id.toString() === id_testSystem
		);
		return testSystem?.alias !== vtiCode;
	}
};
