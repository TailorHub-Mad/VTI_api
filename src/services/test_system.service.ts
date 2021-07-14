import {
	createTestSystemValidation,
	groupTestSystemValidation,
	updateTestSystemValidation
} from '../validations/test_system.validation';
import { IClient, ITestSystem } from '../interfaces/models.interface';
import { BaseError } from '@errors/base.error';
import { checkVtiCode } from '../repositories/test_system.repository';
import {
	createModelsInClientRepository,
	updateModelsInClientRepository
} from '../repositories/client.repository';
import { mongoIdValidation } from '../validations/common.validation';
import QueryString from 'qs';
import { IPopulateGroup } from 'src/interfaces/aggregate.interface';
import { groupRepository } from 'src/repositories/aggregate.repository';
import { GROUP_TEST_SYSTEM } from '@constants/group.constans';

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

export const groupTestSystem = async (query: QueryString.ParsedQs): Promise<ITestSystem[]> => {
	const queryValid = await groupTestSystemValidation.validateAsync(query);
	let populate: IPopulateGroup | undefined;
	// if (queryValid.group.includes('tags')) {
	// 	queryValid.group = 'notes.tags.name';
	// 	populate = { field: 'tagnotes', property: 'tags' };
	// }
	const testSystem = await groupRepository<ITestSystem, typeof GROUP_TEST_SYSTEM[number]>(
		queryValid.group,
		'testSystem',
		{ real: queryValid.real, populate }
	);
	return testSystem;
};
