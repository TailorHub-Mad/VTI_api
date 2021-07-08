import { BaseError } from '@errors/base.error';
import {
	createModelsInClientRepository,
	updateModelsInClientRepository
} from '../repositories/client.repository';
import { checkAlias } from '../repositories/project.respository';
import { mongoIdValidation } from '../validations/common.validation';
import {
	createProjectValidation,
	orderProjectValidation,
	updateProjectValidation
} from '../validations/project.validation';
import { IProjects } from '../interfaces/models.interface';
import QueryString from 'qs';
import { groupRepository } from 'src/repositories/aggregate.repository';
import { GROUP_PROJECT } from '@constants/group.constans';

export const createProject = async (body: Partial<IProjects>): Promise<void> => {
	const projectValidation = await createProjectValidation.validateAsync(body);

	if (await checkAlias(projectValidation.alias)) {
		throw new BaseError('Alias in used', 400);
	}

	await createModelsInClientRepository('projects', projectValidation.client, projectValidation);
};

export const updateProject = async (
	id_project: string,
	body: Partial<IProjects>
): Promise<void> => {
	const projectValidation = await updateProjectValidation.validateAsync(body);
	const projectIdValidation = await mongoIdValidation.validateAsync(id_project);

	if (await checkAlias(projectValidation.alias)) {
		throw new BaseError('Alias in used', 400);
	}

	await updateModelsInClientRepository('projects', projectIdValidation, projectValidation);
};

export const orderProject = async (query: QueryString.ParsedQs): Promise<IProjects[]> => {
	const queryValid = await orderProjectValidation.validateAsync(query);
	const projects = await groupRepository<IProjects, typeof GROUP_PROJECT[number]>(
		queryValid.group,
		'projects',
		queryValid.real
	);
	return projects;
};
