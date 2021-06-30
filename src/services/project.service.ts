import { BaseError } from '@errors/base.error';
import {
	createModelsInClientRepository,
	updateModelsInClientRepository
} from '../repositories/client.repository';
import { checkAlias } from '../repositories/project.respository';
import { mongoIdValidation } from '../validations/common.validation';
import {
	createProjectValidation,
	updateProjectValidation
} from '../validations/project.validation';
import { IProjects } from '../interfaces/models.interface';

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
