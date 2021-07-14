/* eslint-disable @typescript-eslint/no-explicit-any */
import { addGroup, findKey, populateAggregate } from '@utils/aggregate.utils';
import { FilterQuery } from 'mongoose';
import { IPopulateGroup } from 'src/interfaces/aggregate.interface';
import { Pagination } from '../interfaces/config.interface';
import { IClientModel } from '../interfaces/models.interface';
import { ClientModel } from '../models/client.model';

/**
 *
 * @param param0
 * @param pagination
 * @param order
 * @returns
 *
 *
 * @match Filtro principal
 * Filtrará por index: 'testSystem.vtiCode' 'testSystem.alias' 'testSystem.notes.title' 'projects.alias' 'projects.notes.title'
 *

 * @_extends Separación de arrays en objectos
 * Ejemplo: 'testSystem.notes'
 * Separará el array de testSystem en objectos y luego estos otra vez por cada notes que tenga para poder filtrar por ellos.
 *
 * @querys Las busquedas que quieras hacer. La sintaxis es la misma de mongoose. Si extendemos podemos filtrar por esos nuevos campos.
 * Ejemplo: { $and: [{ testSystem.notes.title: { $regex: '^01' } }, { alias: 'GA OSTRAVA-068' }]}
 *
 * @nameField Nombre del nuevo campo donde se agruparan todos los nuevos campos
 * Ejemplo: 'notes'
 *
 * @group Para agrupar los datos que hemos obtenido
 */

export const aggregateCrud = async (
	{
		match,
		_extends,
		querys,
		nameFild,
		group
	}: {
		match?: string;
		_extends?: string;
		nameFild?: string;
		querys: FilterQuery<IClientModel>;
		group?: string;
	},
	pagination?: Pagination,
	order?: { [key: string]: -1 | 1 }
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> => {
	const pipeline: unknown[] = match
		? [
				{
					$match: {
						$text: {
							$search: `"${match}"`
						}
					}
				}
		  ]
		: [];

	const fields = _extends?.split('.');
	if (fields) {
		fields.forEach((_, index, array) => {
			pipeline.push({
				$unwind: {
					path: `$${array.slice(0, index + 1).join('.')}`
				}
			});
		});
	}

	pipeline.push({
		$match: querys
	});

	if (order) {
		pipeline.push({
			$sort: order
		});
	}
	if (pagination) {
		if (pagination.offset > 0) {
			pipeline.push({
				$skip: pagination.offset
			});
		}
		if (pagination.limit > 0) {
			pipeline.push({
				$limit: pagination.limit
			});
		}
	}

	if (_extends && nameFild) {
		pipeline.push({
			$addFields: {
				[nameFild]: `$${_extends}`
			}
		});
		pipeline.push({
			$addFields: {
				[`${nameFild}.clientAlias`]: `$alias`
			}
		});

		pipeline.push({
			$sort: order || { [`${nameFild}.updatedAt`]: -1 }
		});

		pipeline.push({
			$group: {
				_id: group || '$_id',
				[nameFild]: {
					$push: `$${nameFild}`
				}
			}
		});
	}

	return await ClientModel.aggregate(pipeline).sort({ _id: 1 }).collation({
		locale: 'es',
		numericOrdering: true
	});
};

export const groupRepository = async <T, G extends string>(
	group: G,
	field: string,
	options?: { real?: boolean; populate?: IPopulateGroup }
): Promise<T[]> => {
	const searchField = group.split('.');
	searchField.splice(-1);

	const pipeline = [];

	pipeline.push(
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
		}
	);

	if (options?.populate) {
		pipeline.unshift(
			...populateAggregate(field, {
				searchModel: options.populate.field,
				searchField: searchField.join('.')
			})
		);
		pipeline.push({
			$unwind: `$aux.${options.populate.property}`
		});
	}

	const properties = await ClientModel.aggregate(pipeline)
		.sort({ [`aux.${group}`]: 1 })
		.collation({
			locale: 'es',
			numericOrdering: true
		});

	// const findKey = (value: string, aux: any, real?: boolean) => {
	// 	return real ? value : value.match(/^\d/) ? '0-9' : (aux[group][0] as string).toUpperCase();
	// };

	// const addGroup = (aux: any, property: { [key: string]: { alias: string }[] }, key: string) => {
	// 	if (property[key]) {
	// 		if (!property[key].find((group) => group.alias === aux.alias)) property[key].push(aux);
	// 	} else {
	// 		property[key] = [aux];
	// 	}
	// };

	return properties.reduce((projectsGroup, { aux }) => {
		const valueGroup = group.split('.').filter((property) => property !== field);
		let value = valueGroup.reduce((field, property) => {
			return aux[property] || (field as unknown as { [key: string]: string })[property];
		}, '');

		let key = findKey(value, aux, group, options?.real);
		addGroup(aux, projectsGroup, key);
		if (aux?.tags?.relatedTags) {
			for (const tag of aux.tags.relatedTags) {
				value = tag.name;
				key = findKey(value, aux, group, options?.real);
				addGroup(aux, projectsGroup, key);
			}
		}
		return projectsGroup;
	}, {} as { [key: string]: T[] });
};
