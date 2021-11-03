/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { groupAggregate, populateAggregate } from '@utils/aggregate.utils';
import { FilterQuery, Types } from 'mongoose';
import { IPopulateGroup } from '../interfaces/aggregate.interface';
import { Pagination } from '../interfaces/config.interface';
import { IClientModel, IReqUser, IUserDocument } from '../interfaces/models.interface';
import { ClientModel } from '../models/client.model';
import QueryString from 'qs';
import { PROJECT_NOTES, PROJECT_PROJECTS, PROJECT_TESTSYSTEMS } from '@constants/group.constans';
import { findOneRepository } from './common.repository';
import { UserModel } from '../models/user.model';

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
	order?: { [key: string]: -1 | 1 },
	reqUser?: IReqUser
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

	if (reqUser && reqUser?.role !== 'admin') {
		const date = new Date();
		pipeline.push({
			$addFields: {
				notes: {
					$filter: {
						input: '$notes',
						as: 'note',
						cond: {
							$or: [
								{ $gte: [date, '$$note.updateLimitDate'] },
								{ $eq: ['$$note.owner', Types.ObjectId(reqUser?.id)] }
							]
						}
					}
				}
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

	if (nameFild === 'notes') {
		pipeline.push(
			{
				$lookup: {
					from: 'tagnotes',
					localField: 'notes.tags',
					foreignField: '_id',
					as: 'notes.tags'
				}
			},
			{
				$lookup: {
					from: 'users',
					localField: 'notes.owner',
					foreignField: '_id',
					as: 'notes.owner'
				}
			}
		);
	}
	if (nameFild === 'testSystems') {
		pipeline.push(
			{
				$lookup: {
					from: 'vticodes',
					localField: 'testSystems.vtiCode',
					foreignField: '_id',
					as: 'testSystems.vtiCode'
				}
			},
			{
				$addFields: {
					'testSystems.vtiCode': {
						$arrayElemAt: ['$testSystems.vtiCode', 0]
					}
				}
			},
			{
				$addFields: {
					'testSystems.vtiCode': '$testSystems.vtiCode.name'
				}
			}
		);
	}

	pipeline.push({
		$addFields: {
			[`${nameFild}.clientAlias`]: '$alias'
		}
	});

	// if (order) {
	// 	pipeline.push({
	// 		$sort: order
	// 	});
	// }
	// if (pagination) {
	// 	if (pagination.offset > 0) {
	// 		pipeline.push({
	// 			$skip: pagination.offset
	// 		});
	// 	}
	// 	if (pagination.limit > 0) {
	// 		pipeline.push({
	// 			$limit: pagination.limit
	// 		});
	// 	}
	// }

	if (_extends && nameFild) {
		pipeline.push({
			$addFields: {
				[`${nameFild}.clientAlias`]: `$alias`,
				[`${nameFild}.clientId`]: `$_id`
			}
		});

		// pipeline.push({
		// 	$sort: order || { [`${nameFild}.updatedAt`]: -1 }
		// });

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
						from: 'users',
						localField: 'projects.users',
						foreignField: '_id',
						as: 'projects.users'
					}
				},
				{
					$lookup: {
						from: 'tagprojects',
						localField: 'projects.tags',
						foreignField: '_id',
						as: 'projects.tags'
					}
				},
				{
					$addFields: {
						'projects.isActive': {
							$cond: {
								if: '$projects.closed',
								then: false,
								else: true
							}
						}
					}
				}
			);
		}

		if (populates) {
			if (populates.includes('testSystems') && nameFild === 'projects') {
				// pipeline.push(
				// 	{
				// 		$unwind: {
				// 			path: '$testSystems',
				// 			preserveNullAndEmptyArrays: true
				// 		}
				// 	},
				// 	{
				// 		$lookup: {
				// 			from: 'vticodes',
				// 			localField: 'testSystems.vtiCode',
				// 			foreignField: '_id',
				// 			as: 'testSystems.vtiCode'
				// 		}
				// 	},
				// 	{
				// 		$addFields: {
				// 			'testSystems.vtiCode': {
				// 				$arrayElemAt: ['$testSystems.vtiCode', 0]
				// 			}
				// 		}
				// 	},
				// 	{
				// 		$addFields: {
				// 			'testSystems.vtiCode': '$testSystems.vtiCode.name'
				// 		}
				// 	},
				// 	{
				// 		$group: {
				// 			_id: '$_id',
				// 			client: {
				// 				$first: '$$ROOT'
				// 			},
				// 			testSystems: {
				// 				$push: '$$ROOT.testSystems'
				// 			}
				// 		}
				// 	},
				// 	{
				// 		$replaceRoot: {
				// 			newRoot: { $mergeObjects: ['$client', { testSystems: '$testSystems' }] }
				// 		}
				// 	}
				// );
			}
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
			if (populates.includes('notes') && nameFild === 'projects') {
				pipeline.push(
					{
						$unwind: {
							path: '$projects.notes',
							preserveNullAndEmptyArrays: true
						}
					},
					{
						$addFields: {
							'projects.notes.testSystems': {
								$filter: {
									input: '$testSystems',
									as: 'testSystem',
									cond: {
										$in: ['$projects.notes._id', '$$testSystem.notes']
									}
								}
							}
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
						$lookup: {
							from: 'users',
							localField: 'projects.notes.owner',
							foreignField: '_id',
							as: 'projects.notes.owner'
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
			if (populates.includes('notes') && nameFild === 'testSystems') {
				pipeline.push(
					{
						$unwind: {
							path: '$testSystems.notes',
							preserveNullAndEmptyArrays: true
						}
					},
					{
						$addFields: {
							'testSystems.notes.projects': {
								$filter: {
									input: '$projects',
									as: 'testSystem',
									cond: {
										$in: ['$testSystems.notes._id', '$$testSystem.notes']
									}
								}
							}
						}
					},
					{
						$lookup: {
							from: 'tagnotes',
							localField: 'testSystems.notes.tags',
							foreignField: '_id',
							as: 'testSystems.notes.tags'
						}
					},
					{
						$lookup: {
							from: 'users',
							localField: 'testSystems.notes.owner',
							foreignField: '_id',
							as: 'testSystems.notes.owner'
						}
					},
					{
						$replaceRoot: {
							newRoot: { $mergeObjects: ['$testSystems'] }
						}
					},
					{
						$group: {
							_id: '$_id',
							testSystems: {
								$first: '$$ROOT'
							},
							notes: {
								$push: '$$ROOT.notes'
							}
						}
					},
					{
						$replaceRoot: {
							newRoot: { $mergeObjects: ['$testSystems', { notes: '$notes' }] }
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
							testSystems: {
								$push: '$$ROOT'
							}
						}
					}
				);
			}
		}

		if (nameFild === 'projects') {
			pipeline.push(PROJECT_PROJECTS);
		}

		if (nameFild === 'testSystems') {
			pipeline.push(PROJECT_TESTSYSTEMS);
		}

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
						},
						'notes.isAnswered': {
							$cond: {
								if: {
									$size: ['$notes.messages']
								},
								then: true,
								else: false
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
					$addFields: {
						'notes.isDocuments': {
							$cond: {
								if: {
									$or: [
										{ $size: ['$notes.documents'] },
										{
											$and: [
												{ $gt: ['$notes.messages.documents', null] },
												{ $size: ['$notes.messages.documents'] }
											]
										}
									]
								},
								then: true,
								else: false
							}
						}
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
				},
				PROJECT_NOTES
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
				$sort: order || {
					[`${nameFild}.updatedAt`]: -1
				}
			}
		);
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
		pipeline.push({
			$group: {
				_id: null,
				[nameFild as string]: {
					$push: `$${nameFild}`
				}
			}
		});
	} else {
		pipeline.push({
			$sort: order || {
				[`${nameFild}.updatedAt`]: -1
			}
		});
	}

	return await ClientModel.aggregate(pipeline).collation({
		locale: 'es',
		numericOrdering: true
	});
};

export const groupRepository = async <T, G extends string>(
	group: G,
	field: string,
	options?: { real?: boolean; populate?: IPopulateGroup },
	query?: QueryString.ParsedQs,
	match?: QueryString.ParsedQs,
	reqUser?: IReqUser
): Promise<T[]> => {
	const searchField = group.split('.');
	searchField.splice(-1);
	const union = query?.union ? '$and' : '$or';
	if (query?.union) {
		delete query.union;
	}
	const aux = [];
	if ((query?.subscribed || query?.favorites || query?.noRead) && reqUser) {
		const user = await findOneRepository<IUserDocument>(UserModel, { _id: reqUser.id });
		if (user) {
			if (query?.subscribed) {
				delete query.subscribed;
				if (user.subscribed.notes.length > 0) {
					aux.push({
						$or: user.subscribed.notes.map((note) => ({ 'notes._id': Types.ObjectId(note) }))
					});
				} else {
					return [];
				}
			}
			if (query?.favorites) {
				delete query.favorites;
				if (user.favorites.notes.length > 0) {
					aux.push({
						$or: user.favorites.notes.map((note) => ({ 'notes._id': Types.ObjectId(note) }))
					});
				} else {
					return [];
				}
			}
			if (query?.noRead) {
				delete query.noRead;
				aux.push({ 'notes.readBy': Types.ObjectId(user._id) });
			}
		}
	}
	const transformQueryToArray = query
		? [
				...Object.entries(query!).map(([key, value]) => {
					if (Array.isArray(value)) {
						return {
							$and: value.map((v) => ({
								[key]:
									key.includes('_id') ||
									key.includes('tags') ||
									(key.includes('vtiCode') && field !== 'testSystems') ||
									key.includes('sector')
										? Types.ObjectId(v as string)
										: v === 'true'
										? true
										: { $regex: v, $options: 'i' }
							}))
						};
					}
					return {
						[key]:
							key.includes('_id') ||
							key.includes('tags') ||
							(key.includes('vtiCode') && field !== 'testSystems') ||
							key.includes('sector')
								? Types.ObjectId(value as string)
								: value === 'true'
								? true
								: { $regex: value, $options: 'i' }
					};
				}),
				...aux
		  ]
		: [];
	const transformQuery =
		transformQueryToArray.length > 0
			? {
					[union]: transformQueryToArray
			  }
			: {};
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
					from: 'users',
					localField: 'notes.owner',
					foreignField: '_id',
					as: 'notes.owner'
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
					},
					'notes.isAnswered': {
						$cond: {
							if: {
								$size: ['$notes.messages']
							},
							then: true,
							else: false
						}
					},
					[`${field}.clientAlias`]: '$alias'
				}
			}
		);
		if (!options?.populate) {
			pipeline.push(
				{
					$lookup: {
						from: 'tagnotes',
						localField: 'notes.tags',
						foreignField: '_id',
						as: 'notes.tags'
					}
				},
				PROJECT_NOTES
			);
		}
	}

	if (field === 'testSystems') {
		const populates = ['notes', 'projects'];
		pipeline.push(
			{
				$unwind: {
					path: '$testSystems'
				}
			},
			{
				$lookup: {
					from: 'vticodes',
					localField: 'testSystems.vtiCode',
					foreignField: '_id',
					as: 'testSystems.vtiCode'
				}
			},
			{
				$addFields: {
					'testSystems.vtiCode': {
						$arrayElemAt: ['$testSystems.vtiCode', 0]
					},
					[`${field}.clientAlias`]: '$alias'
				}
			},
			{
				$addFields: {
					'testSystems.vtiCode': '$testSystems.vtiCode.name'
				}
			}
		);
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
		pipeline.push(PROJECT_TESTSYSTEMS);
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
			}
		);
		if (!options?.populate) {
			pipeline.push({
				$lookup: {
					from: 'tagprojects',
					localField: 'projects.tags',
					foreignField: '_id',
					as: 'projects.tags'
				}
			});
		}
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
				$lookup: {
					from: 'users',
					localField: 'projects.notes.owner',
					foreignField: '_id',
					as: 'projects.notes.owner'
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
			},
			PROJECT_PROJECTS
		);
	}

	pipeline.push(
		{
			$unwind: `$${field}`
		},
		{
			$match: match || transformQuery || {}
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
				'aux.clientAlias': {
					$cond: {
						if: '$alias',
						then: '$alias',
						else: '$aux.clientAlias'
					}
				}
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
