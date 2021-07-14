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
import { IPopulateGroup } from 'src/interfaces/aggregate.interface';

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
	let populate: IPopulateGroup | undefined;
	if (queryValid.group.includes('tags')) {
		queryValid.group = 'projects.tags.name';
		populate = { field: 'tagprojects', property: 'tags' };
	}
	const projects = await groupRepository<IProjects, typeof GROUP_PROJECT[number]>(
		queryValid.group,
		'projects',
		{ real: queryValid.real, populate }
	);
	return projects;
};

/**
 *
 {
	 Mongoose: clients.aggregate(
		 [
			 { $unwind: '$notes' },
			 {
				 $lookup: {
					 from: 'tagnotes',
					 localField: 'notes.tags',
					 foreignField: '_id',
					 as: 'notes.tags'
				 }
			 },
			 { $group: { _id: '$_id', old: { $first: '$$ROOT' }, notes: { $push: '$notes' } } },
			 { $replaceRoot: { newRoot: { $mergeObjects: ['$old', { notes: '$notes' }] } } },
			 { $unwind: '$notes' },
			 { $project: { _id: 0, aux: '$notes', alias: '$alias' } },
			 { $addFields: { 'aux.client': '$alias' } },
			 { $unwind: '$aux.tags' },
			 { $sort: { 'aux.notes.tags.name': 1 } }
		 ],
		 { collation: { locale: 'es', numericOrdering: true } }
	 );
 }
 *---
 {
	 Mongoose: clients.aggregate(
		 [
			 { $unwind: '$notes' },
			 {
				 $lookup: {
					 from: 'tagsnotes',
					 localField: 'notes.tags',
					 foreignField: '_id',
					 as: 'notes.tags'
				 }
			 },
			 { $group: { _id: '$_id', old: { $first: '$$ROOT' }, notes: { $push: '$notes' } } },
			 { $replaceRoot: { newRoot: { $mergeObjects: ['$old', { notes: '$notes' }] } } },
			 { $unwind: '$notes' },
			 { $project: { _id: 0, aux: '$notes', alias: '$alias' } },
			 { $addFields: { 'aux.client': '$alias' } },
			 { $unwind: '$aux.tags' },
			 { $sort: { 'aux.notes.tags.name': 1 } }
		 ],
		 { collation: { locale: 'es', numericOrdering: true } }
	 );
 }


 * ---
 {
	Mongoose: clients.aggregate(
		[
			{ $unwind: '$notes' },
			{
				$lookup: {
					from: 'tagnotes',
					localField: 'notes.tags',
					foreignField: '_id',
					as: 'notes.tags'
				}
			},
			{ $group: { _id: '$_id', old: { $first: '$$ROOT' }, notes: { $push: '$notes' } } },
			{ $replaceRoot: { newRoot: { $mergeObjects: ['$old', { notes: '$notes' }] } } },
			{ $unwind: '$notes' },
			{ $project: { _id: 0, aux: '$notes', alias: '$alias' } },
			{ $addFields: { 'aux.client': '$alias' } },
			{ $unwind: '$aux.tags' },
			{ $sort: { 'aux.notes.tags.name': 1 } }
		],
		{ collation: { locale: 'es', numericOrdering: true } }
	);
	}

--
		// ...populateAggregate(field, {
		// 	searchModel: 'tagnotes',
		// 	searchField: searchField.join('.')
		// }),
		{
			$unwind: `$${field}`
		},
		{
			$project: {
				_id: 0,
				aux: `$${field}`,
				alias: '$alias'
			}
		},
		{
			$addFields: {
				'aux.client': '$alias'
			}
		} // ,
		// {
		// 	$unwind: `$aux.tags`

 */
