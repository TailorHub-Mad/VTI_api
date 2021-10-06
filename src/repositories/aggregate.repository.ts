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

	pipeline.push({
		$addFields: {
			[`${nameFild}.clientAlias`]: '$alias'
		}
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
		// pipeline.push({
		// 	$addFields: {
		// 		[nameFild]: `$${_extends}`
		// 	}
		// });
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
				},
				{
					$lookup: {
						from: 'tagprojects',
						localField: 'projects.tags',
						foreignField: '_id',
						as: 'projects.tags'
					}
				}
			);
		}

		if (populates) {
			populates.forEach((populate) => {
				pipeline.push({
					$addFields: {
						[`${nameFild}.${populate}`]: {
							$filter: {
								input: `$${populate}`,
								as: 'populate',
								cond: {
									$in: ['$$populate._id', `$${nameFild}.${populate}`]
								}
							}
						}
					}
				});
			});
			if (populates.includes('notes')) {
				pipeline.push(
					{
						$unwind: {
							path: '$projects.notes',
							preserveNullAndEmptyArrays: true
						}
					},
					{
						$lookup: {
							from: 'tagnotes',
							localField: 'projects.notes.tags',
							foreignField: '_id',
							as: 'projects.notes.tags'
						}
					},
					{
						$replaceRoot: {
							newRoot: { $mergeObjects: ['$projects'] }
						}
					},
					{
						$group: {
							_id: '$_id',
							projects: {
								$first: '$$ROOT'
							},
							notes: {
								$push: '$$ROOT.notes'
							}
						}
					},
					{
						$replaceRoot: {
							newRoot: { $mergeObjects: ['$projects', { notes: '$notes' }] }
						}
					},
					{
						$sort: {
							updatedAt: -1
						}
					},
					{
						$group: {
							_id: null,
							projects: {
								$push: '$$ROOT'
							}
						}
					}
				);
			}
			// pipeline.push({
			// 	$group: {
			// 		_id: null,
			// 		[nameFild]: {
			// 			$push: `$${nameFild}`
			// 		}
			// 	}
			// });
			// pipeline.push(
			// 	{
			// 		$group: {
			// 			_id: '$_id',
			// 			client: {
			// 				$first: '$$ROOT'
			// 			},
			// 			[nameFild]: {
			// 				$push: `$${nameFild}`
			// 			}
			// 		}
			// 	},
			// 	{
			// 		$replaceRoot: {
			// 			newRoot: { $mergeObjects: ['$client', { [nameFild]: `$${nameFild}` }] }
			// 		}
			// 	}
			// );
		}
		// console.log(querys)

		// pipeline.push({
		// 	$match: {
		// 		$expr: {
		// 			$eq: ['Oleaje', '$projects']
		// 		}
		// 	}
		// });
		if (nameFild === 'notes') {
			pipeline.push(
				{
					$unwind: {
						path: '$notes',
						preserveNullAndEmptyArrays: true
					}
				},
				{
					$addFields: {
						'notes.projects': {
							$filter: {
								input: '$projects',
								as: 'project',
								cond: {
									$in: ['$notes._id', '$$project.notes']
								}
							}
						},
						'notes.testSystems': {
							$filter: {
								input: '$testSystems',
								as: 'testSystem',
								cond: {
									$in: ['$notes._id', '$$testSystem.notes']
								}
							}
						}
					}
				},
				{
					$unwind: {
						path: '$notes.messages',
						preserveNullAndEmptyArrays: true
					}
				},
				{
					$lookup: {
						from: 'users',
						localField: 'notes.messages.owner',
						foreignField: '_id',
						as: 'notes.messages.owner'
					}
				},
				{
					$replaceRoot: {
						newRoot: { $mergeObjects: ['$notes'] }
					}
				},
				{
					$group: {
						_id: '$_id',
						notes: {
							$first: '$$ROOT'
						},
						messages: {
							$push: '$messages'
						}
					}
				},
				{
					$replaceRoot: {
						newRoot: { $mergeObjects: ['$notes', { messages: '$messages' }] }
					}
				},
				{
					$group: {
						_id: null,
						notes: {
							$push: '$$ROOT'
						}
					}
				}
			);
		} else if (!populates || !populates.includes('notes')) {
			pipeline.push({
				$group: {
					_id: group || '$_id',
					[nameFild]: {
						$push: `$${nameFild}`
					}
				}
			});
		}
	}
	if (nameFild) {
		pipeline.push(
			{
				$unwind: {
					path: `$${nameFild}`
				}
			},
			{
				$match: querys
			},
			{
				$group: {
					_id: null,
					[nameFild as string]: {
						$push: `$${nameFild}`
					}
				}
			}
		);
	}

	return await ClientModel.aggregate(pipeline).collation({
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

	if (field === 'notes') {
		pipeline.push(
			{
				$unwind: {
					path: '$projects',
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$lookup: {
					from: 'sectors',
					localField: 'projects.sector',
					foreignField: '_id',
					as: 'projects.sector'
				}
			},
			{
				$group: {
					_id: '$_id',
					client: {
						$first: '$$ROOT'
					},
					projects: {
						$push: '$projects'
					}
				}
			},
			{
				$replaceRoot: {
					newRoot: { $mergeObjects: ['$client', { projects: '$projects' }] }
				}
			},
			{
				$unwind: {
					path: '$notes'
				}
			},
			{
				$lookup: {
					from: 'tagnotes',
					localField: 'notes.tags',
					foreignField: '_id',
					as: 'notes.tags'
				}
			},
			{
				$addFields: {
					'notes.projects': {
						$filter: {
							input: '$projects',
							as: 'project',
							cond: {
								$in: ['$notes._id', '$$project.notes']
							}
						}
					},
					'notes.testSystems': {
						$filter: {
							input: '$testSystems',
							as: 'testSystem',
							cond: {
								$in: ['$notes._id', '$$testSystem.notes']
							}
						}
					},
					'notes.year': {
						$dateToString: {
							date: '$notes.createdAt',
							format: '%Y'
						}
					}
				}
			}
		);
	}

	if (field === 'testSystems') {
		const populates = ['notes', 'projects'];
		pipeline.push({
			$unwind: {
				path: '$testSystems'
			}
		});
		populates.forEach((populate) => {
			pipeline.push({
				$addFields: {
					[`${field}.${populate}`]: {
						$filter: {
							input: `$${populate}`,
							as: 'populate',
							cond: {
								$in: ['$$populate._id', `$${field}.${populate}`]
							}
						}
					}
				}
			});
		});
	}

	if (field === 'projects') {
		pipeline.push(
			{
				$unwind: {
					path: '$projects'
				}
			},
			{
				$addFields: {
					[`${field}.clientAlias`]: '$alias'
				}
			},
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
			},
			{
				$lookup: {
					from: 'tagprojects',
					localField: 'projects.tags',
					foreignField: '_id',
					as: 'projects.tags'
				}
			}
		);
		const populates = ['notes', 'testSystems'];
		populates.forEach((populate) => {
			pipeline.push({
				$addFields: {
					[`${field}.${populate}`]: {
						$filter: {
							input: `$${populate}`,
							as: 'populate',
							cond: {
								$in: ['$$populate._id', `$${field}.${populate}`]
							}
						}
					}
				}
			});
		});
		pipeline.push(
			{
				$unwind: {
					path: '$projects.notes',
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$lookup: {
					from: 'tagnotes',
					localField: 'projects.notes.tags',
					foreignField: '_id',
					as: 'projects.notes.tags'
				}
			},
			{
				$replaceRoot: {
					newRoot: { $mergeObjects: ['$projects'] }
				}
			},
			{
				$group: {
					_id: '$_id',
					projects: {
						$first: '$$ROOT'
					},
					notes: {
						$push: '$$ROOT.notes'
					}
				}
			},
			{
				$replaceRoot: {
					newRoot: { $mergeObjects: ['$projects', { notes: '$notes' }] }
				}
			},
			{
				$sort: {
					updatedAt: -1
				}
			},
			{
				$group: {
					_id: null,
					projects: {
						$push: '$$ROOT'
					}
				}
			}
		);
	}

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

	// if (field === 'projects') {
	// 	pipeline.push({
	// 		$lookup: {
	// 			from: 'sectors',
	// 			localField: 'aux.sector',
	// 			foreignField: '_id',
	// 			as: 'aux.sector'
	// 		}
	// 	});
	// }
	const properties = await ClientModel.aggregate(pipeline)
		.sort({ [`aux.${group}`]: -1 })
		.collation({
			locale: 'es',
			numericOrdering: true
		});
	// console.log(JSON.stringify(properties));
	// console.log(properties);
	// return properties;
	return groupAggregate<T, G>(properties, { group, field, real: options?.real });
};
