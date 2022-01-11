import {
	createTestSystemValidation,
	groupTestSystemValidation,
	updateTestSystemValidation
} from '../validations/test_system.validation';
import { IClient, IClientModel, ITestSystem } from '../interfaces/models.interface';
import { BaseError } from '@errors/base.error';
import { checkVtiCode } from '../repositories/test_system.repository';
import {
	createModelsInClientRepository,
	deleteModelInClientRepository,
	updateModelsInClientRepository
} from '../repositories/client.repository';
import { mongoIdValidation } from '../validations/common.validation';
import QueryString from 'qs';
import { IPopulateGroup } from '../interfaces/aggregate.interface';
import { groupRepository } from '../repositories/aggregate.repository';
import { GROUP_TEST_SYSTEM } from '@constants/group.constans';
import { createRef } from '@utils/model.utils';
import { FilterQuery } from 'mongoose';

export const createTestSystem = async (body: Partial<IClient>): Promise<string | undefined> => {
	const bodyValidation = await createTestSystemValidation.validateAsync(body);
	const clientId = { ...bodyValidation }.client;

	delete bodyValidation.clientId;

	// if (await checkVtiCode(bodyValidation.vtiCode, { id_client: clientId })) {
	// 	throw new BaseError('vti code in used.', 400);
	// }

	const newRef = await createRef('testSystems');
	bodyValidation.ref = newRef;
	const client = await createModelsInClientRepository('testSystems', clientId, bodyValidation);
	const testSystem = client?.testSystems.find(
		(testSystem) => testSystem.alias === bodyValidation.alias
	);
	return testSystem?.id;
};

export const updateTestSystem = async (
	id_testSystem: string,
	body: Partial<IClient>
): Promise<void> => {
	const bodyValidation = await updateTestSystemValidation.validateAsync(body);
	const validateId = await mongoIdValidation.validateAsync(id_testSystem);

	if (await checkVtiCode(bodyValidation.vtiCode, { id_testSystem })) {
		throw new BaseError('vti code in used.', 400);
	}
	await updateModelsInClientRepository('testSystems', validateId, bodyValidation);
};

export const groupTestSystem = async (query: QueryString.ParsedQs): Promise<ITestSystem[]> => {
	const group = { group: query.group, real: query.real };
	const match = { query: query.query };
	delete query.query;
	delete query.group;
	delete query.real;
	const queryValid = await groupTestSystemValidation.validateAsync(group);
	let populate: IPopulateGroup | undefined;
	if (queryValid.group.includes('tags')) {
		queryValid.group = 'notes.tags.name';
		populate = { field: 'tagnotes', property: 'tags' };
	}
	const testSystems = await groupRepository<ITestSystem, typeof GROUP_TEST_SYSTEM[number]>(
		queryValid.group,
		'testSystems',
		// {},
		{ real: queryValid.real, populate },
		query,
		match.query ? (JSON.parse(match.query as string) as FilterQuery<IClientModel>) : undefined
	);
	return testSystems;
};

export const deleteTestSystem = async (id_testSystem: string): Promise<void> => {
	const validateId = await mongoIdValidation.validateAsync(id_testSystem);

	await deleteModelInClientRepository('testSystems', validateId);
};
