/* eslint-disable @typescript-eslint/no-explicit-any */
import { groupAggregate, populateAggregate } from '@utils/aggregate.utils';
import { FilterQuery } from 'mongoose';
import { IPopulateGroup } from '../interfaces/aggregate.interface';
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
		group,
		populates
	}: {
		match?: string;
		_extends?: string;
		nameFild?: string;
		querys: FilterQuery<IClientModel>;
		group?: string;
		populates?: string[];
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
	if (populates) {
		populates.forEach((populate) => {
			pipeline.push(
				{
					$unwind: {
						path: `$${populate}`
					}
				},
				{
					$unwind: {
						path: `$${nameFild}.${populate}`
					}
				},
				{
					$match: {
						$expr: {
							$eq: [`$${nameFild}.${populate}`, `$${populate}._id`]
						}
					}
				},
				{
					$addFields: {
						[`${nameFild}.${populate}`]: `$${populate}`
					}
				}
			);
		});
		populates.forEach((populate) => {
			pipeline.push(
				{
					$group: {
						_id: `$${nameFild}._id`,
						projects: {
							$first: `$${nameFild}`
						},
						[populate]: {
							$push: `$${nameFild}.${populate}`
						}
					}
				},
				{
					$addFields: {
						[`${nameFild}.${populate}`]: `$${populate}`
					}
				}
			);
		});
	}

	if (nameFild === 'notes') {
		pipeline.push({
			$lookup: {
				from: 'tagnotes',
				localField: 'notes.tags',
				foreignField: '_id',
				as: 'notes.tags'
			}
		});
	}

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
	// console.log(querys)
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

		if (nameFild === 'projects') {
			pipeline.push(
				{
					$lookup: {
						from: 'sectors',
						localField: 'projects.sector',
						foreignField: '_id',
						as: 'projects.sector'
					}
				},
				{
					$lookup: {
						from: 'users',
						localField: 'projects.focusPoint',
						foreignField: '_id',
						as: 'projects.focusPoint'
					}
				}
			);
		}
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
	// pipeline.push({
	// 	$group: {
	// 		_id: `$aux.${group}`,
	// 		[field]: {
	// 			$push: '$aux'
	// 		}
	// 	}
	// });

	const properties = await ClientModel.aggregate(pipeline)
		.sort({ [`aux._id`]: 1 })
		.collation({
			locale: 'es',
			numericOrdering: true
		});
	// console.log(properties);
	// return properties;
	return groupAggregate<T, G>(properties, { group, field, real: options?.real });
};
