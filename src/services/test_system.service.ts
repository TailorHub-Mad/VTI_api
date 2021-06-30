import {
	createTestSystemValidation,
	updateTestSystemValidation
} from '../validations/test_system.validation';
import { IClient } from '../interfaces/models.interface';
import { BaseError } from '@errors/base.error';
import { checkVtiCode } from '../repositories/test_system.repository';
import {
	createModelsInClientRepository,
	updateModelsInClientRepository
} from '../repositories/client.repository';
import { mongoIdValidation } from '../validations/common.validation';

export const createTestSystem = async (body: Partial<IClient>): Promise<void> => {
	const bodyValidation = await createTestSystemValidation.validateAsync(body);
	const clientId = { ...bodyValidation }.client;

	delete bodyValidation.clientId;

	if (await checkVtiCode(bodyValidation.vtiCode)) {
		throw new BaseError('vti code in used.', 400);
	}

	await createModelsInClientRepository('testSystem', clientId, bodyValidation);
};

export const updateTestSystem = async (
	id_testSystem: string,
	body: Partial<IClient>
): Promise<void> => {
	const bodyValidation = await updateTestSystemValidation.validateAsync(body);
	const validateId = await mongoIdValidation.validateAsync(id_testSystem);

	if (await checkVtiCode(bodyValidation.vtiCode)) {
		throw new BaseError('vti code in used.', 400);
	}
	await updateModelsInClientRepository('testSystem', validateId, bodyValidation);
};
