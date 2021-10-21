import { BaseError } from '@errors/base.error';
import {
	createModelsInClientRepository,
	deleteModelInClientRepository,
	updateModelsInClientRepository
} from '../repositories/client.repository';
import { checkAlias } from '../repositories/project.respository';
import { mongoIdValidation } from '../validations/common.validation';
import {
	createProjectValidation,
	orderProjectValidation,
	updateProjectValidation
} from '../validations/project.validation';
import { IProjects, ISectorDocument, IUserDocument } from '../interfaces/models.interface';
import QueryString from 'qs';
import { groupRepository } from '../repositories/aggregate.repository';
import { GROUP_PROJECT } from '@constants/group.constans';
import { IPopulateGroup } from '../interfaces/aggregate.interface';
import { SectorModel } from '../models/sector.model';
import { updateRepository } from '../repositories/common.repository';
import { UserModel } from '../models/user.model';
import { addToSetTags, createRef, updateTags } from '@utils/model.utils';
import { TagProjectModel } from '../models/tag_project.model';

export const createProject = async (body: Partial<IProjects>): Promise<string | undefined> => {
	const projectValidation = await createProjectValidation.validateAsync(body);

	if (await checkAlias(projectValidation.alias, { id_client: projectValidation.client })) {
		throw new BaseError('Alias in used', 400);
	}
	const newRef = await createRef('projects');
	projectValidation.ref = newRef;
	const client = await createModelsInClientRepository(
		'projects',
		projectValidation.client,
		projectValidation
	);

	if (client) {
		const project = client.projects.find((project) => project.alias === projectValidation.alias);
		if (projectValidation.focusPoint) {
			updateRepository<IUserDocument>(
				UserModel,
				{ _id: projectValidation.focusPoint },
				{ $addToSet: { focusPoint: project.alias } }
			);
		}
		if (projectValidation.testSystems && client) {
			Promise.all(
				projectValidation.testSystems.map((testSystem: string) => {
					return updateModelsInClientRepository(
						'testSystems',
						testSystem,
						{
							$addToSet: { 'testSystems.$.projects': project._id }
						},
						true
					);
				})
			);
		}
		await addToSetTags(
			project,
			{ field: 'projects', property: 'alias', model: TagProjectModel },
			projectValidation.tags
		);

		await updateRepository<ISectorDocument>(
			SectorModel,
			{
				_id: projectValidation.sector
			},
			{ $addToSet: { projects: projectValidation.alias } }
		);

		return project._id;
	}
};

export const updateProject = async (
	id_project: string,
	body: Partial<IProjects>
): Promise<void> => {
	const projectValidation = await updateProjectValidation.validateAsync(body);
	const projectIdValidation = await mongoIdValidation.validateAsync(id_project);

	if (await checkAlias(projectValidation.alias, { id_project })) {
		throw new BaseError('Alias in used', 400);
	}

	const client = await updateModelsInClientRepository(
		'projects',
		projectIdValidation,
		projectValidation
	);
	if (client) {
		const project = client.projects.find((project) => project._id.toString() === id_project);
		await updateTags(project, projectValidation.tags, {
			field: 'projects',
			property: 'alias',
			model: TagProjectModel
		});
		if (projectValidation.testSystems) {
			project.testSystems = project.testSystems.map((testSystem: string) => testSystem.toString());
			const addToSet = projectValidation.testSystems.filter(
				(testSystem: string) => !project.testSystems.includes(testSystem)
			);
			const pull = project.testSystems.filter(
				(testSystem: string) => !projectValidation.testSystems.includes(testSystem)
			);
			await Promise.all(
				addToSet.map((testSystem: string) => {
					return updateModelsInClientRepository(
						'testSystems',
						testSystem,
						{
							$addToSet: { 'testSystems.$.projects': project._id }
						},
						true
					);
				})
			);
			await Promise.all(
				pull.map((testSystem: string) => {
					return updateModelsInClientRepository(
						'testSystems',
						testSystem,
						{
							$pull: { 'testSystems.$.projects': project._id }
						},
						true
					);
				})
			);
		}
		if (
			project?.sector?.toString() !== projectValidation?.sector ||
			project?.alias !== projectValidation.alias
		) {
			await updateRepository<ISectorDocument>(
				SectorModel,
				{
					_id: project.sector
				},
				{ $pull: { projects: project.alias } }
			);
			await updateRepository<ISectorDocument>(
				SectorModel,
				{
					_id: projectValidation.sector
				},
				{ $addToSet: { projects: projectValidation.alias } }
			);
			updateRepository<IUserDocument>(
				UserModel,
				{ _id: { $in: project.focusPoint } },
				{ $pull: { focusPoint: project.alias } }
			);
			updateRepository<IUserDocument>(
				UserModel,
				{ _id: { $in: project.focusPoint } },
				{ $addToSet: { focusPoint: projectValidation.alias } }
			);
		}
	}
};

export const deleteProject = async (id_project: string): Promise<void> => {
	const projectIdValidation = await mongoIdValidation.validateAsync(id_project);

	const client = await deleteModelInClientRepository('projects', projectIdValidation);
	if (client) {
		const project = client.projects.find(
			(project) => project._id.toString() === projectIdValidation.toString()
		);
		await UserModel.updateMany(
			{},
			{ $pull: { projectsComments: project.alias, focusPoint: project.alias } }
		);
		await updateRepository<ISectorDocument>(
			SectorModel,
			{
				_id: project.sector
			},
			{ $pull: { projects: project.alias } }
		);
	}
};

export const orderProject = async (query: QueryString.ParsedQs): Promise<IProjects[]> => {
	const queryValid = await orderProjectValidation.validateAsync(query);
	let populate: IPopulateGroup | undefined;
	if (queryValid.group.includes('tags')) {
		queryValid.group = 'projects.tags.name';
		populate = { field: 'tagprojects', property: 'tags' };
	}
	const projects = await groupRepository<IProjects, typeof GROUP_PROJECT[number]>(
		queryValid.group,
		'projects',
		// {},
		{ real: queryValid.real, populate }
	);
	return projects;
};
