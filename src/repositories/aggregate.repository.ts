/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { groupAggregate, populateAggregate } from '@utils/aggregate.utils';
import { FilterQuery, Types } from 'mongoose';
import { IPopulateGroup } from '../interfaces/aggregate.interface';
import { Pagination } from '../interfaces/config.interface';
import { IClientModel, IReqUser } from '../interfaces/models.interface';
import { ClientModel } from '../models/client.model';
import QueryString from 'qs';

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
							}
						}
					},
					{
						$addFields: {
							'testSystems.vtiCode': '$testSystems.vtiCode.name'
						}
					},
					{
						$group: {
							_id: '$_id',
							client: {
								$first: '$$ROOT'
							},
							testSystems: {
								$push: '$$ROOT.testSystems'
							}
						}
					},
					{
						$replaceRoot: {
							newRoot: { $mergeObjects: ['$client', { testSystems: '$testSystems' }] }
						}
					}
				);
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

		// if (nameFild === 'projects') {
		// 	pipeline.push({
		// 		$project: {
		// 			'projects.focusPoint._id': 1,
		// 			'projects.focusPoint.name': 1,
		// 			'projects.focusPoint.lastName': 1,
		// 			'projects.focusPoint.email': 1,
		// 			'projects.focusPoint.ref': 1,
		// 			'projects.focusPoint.alias': 1,
		// 			'projects.testSystems._id': 1,
		// 			'projects.testSystems.vtiCode': 1,
		// 			'projects.testSystems.alias': 1,
		// 			'projects.testSystems.ref': 1,
		// 			'projects.tags.ref': 1,
		// 			'projects.tags.name': 1,
		// 			'projects.tags._id': 1,
		// 			'projects.notes.tags.name': 1,
		// 			'projects.notes.tags.ref': 1,
		// 			'projects.notes.tags._id': 1,
		// 			'projects.notes.readBy': 1,
		// 			'projects.notes.isClosed': 1,
		// 			'projects.notes.formalized': 1,
		// 			'projects.notes._id': 1,
		// 			'projects.notes.title': 1,
		// 			'projects.notes.description': 1,
		// 			'projects.notes.link': 1,
		// 			'projects.notes.documents': 1,
		// 			'projects.notes.ref': 1,
		// 			'projects.notes.messages': 1,
		// 			'projects.notes.updateLimitDate': 1,
		// 			'projects.notes.updatedAt': 1,
		// 			'projects.notes.testSystems._id': 1,
		// 			'projects.notes.testSystems.vtiCode': 1,
		// 			'projects.notes.testSystems.alias': 1,
		// 			'projects.notes.testSystems.ref': 1,
		// 			'projects.notes.owner._id': 1,
		// 			'projects.notes.owner.name': 1,
		// 			'projects.notes.owner.alias': 1,
		// 			'projects.notes.owner.ref': 1,
		// 			'projects.notes.owner.email': 1,
		// 			'projects.notes.owner.lastName': 1,
		// 			'projects._id': 1,
		// 			'projects.alias': 1,
		// 			'projects.sector._id': 1,
		// 			'projects.sector.title': 1,
		// 			'projects.sector.ref': 1,
		// 			'projects.date': 1,
		// 			'projects.ref': 1,
		// 			'projects.clientAlias': 1,
		// 			'projects.clientId': 1,
		// 			'projects.isActive': 1,
		// 			'projects.createdAt': 1,
		// 			'projects.updatedAt': 1,
		// 			'projects.closed': 1
		// 		}
		// 	});
		// }

		// if (nameFild === 'testSystems') {
		// 	pipeline.push({
		// 		$project: {
		// 			'testSystems.projects._id': 1,
		// 			'testSystems.projects.alias': 1,
		// 			'testSystems.projects.ref': 1,
		// 			'testSystems.projects.closed': 1,
		// 			'testSystems.projects.date': 1,
		// 			'testSystems.notes.tags.name': 1,
		// 			'testSystems.notes.tags.ref': 1,
		// 			'testSystems.notes.tags._id': 1,
		// 			'testSystems.notes.readBy': 1,
		// 			'testSystems.notes.isClosed': 1,
		// 			'testSystems.notes.formalized': 1,
		// 			'testSystems.notes._id': 1,
		// 			'testSystems.notes.title': 1,
		// 			'testSystems.notes.description': 1,
		// 			'testSystems.notes.link': 1,
		// 			'testSystems.notes.documents': 1,
		// 			'testSystems.notes.ref': 1,
		// 			'testSystems.notes.messages': 1,
		// 			'testSystems.notes.updateLimitDate': 1,
		// 			'testSystems.notes.updatedAt': 1,
		// 			'testSystems.notes.projects._id': 1,
		// 			'testSystems.notes.projects.date': 1,
		// 			'testSystems.notes.projects.closed': 1,
		// 			'testSystems.notes.projects.alias': 1,
		// 			'testSystems.notes.projects.ref': 1,
		// 			'testSystems.notes.owner._id': 1,
		// 			'testSystems.notes.owner.name': 1,
		// 			'testSystems.notes.owner.alias': 1,
		// 			'testSystems.notes.owner.ref': 1,
		// 			'testSystems.notes.owner.email': 1,
		// 			'testSystems.notes.owner.lastName': 1,
		// 			'testSystems._id': 1,
		// 			'testSystems.vtiCode': 1,
		// 			'testSystems.updatedAt': 1,
		// 			'testSystems.createdAt': 1,
		// 			'testSystems.clientAlias': 1,
		// 			'testSystems.clientId': 1
		// 		}
		// 	});
		// }

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
									$and: [{ $size: ['$notes.documents'] }, { $size: ['$notes.messages.documents'] }]
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
				}
				// {
				// 	$project: {
				// 		'notes.tags._id': 1,
				// 		'notes.tags.name': 1,
				// 		'notes.readBy': 1,
				// 		'notes.isClosed': 1,
				// 		'notes.formalized': 1,
				// 		'notes._id': 1,
				// 		'notes.title': 1,
				// 		'notes.description': 1,
				// 		'notes.link': 1,
				// 		'notes.documents': 1,
				// 		'notes.owner._id': 1,
				// 		'notes.owner.name': 1,
				// 		'notes.owner.lastName': 1,
				// 		'notes.owner.alias': 1,
				// 		'notes.owner.ref': 1,
				// 		'notes.owner.email': 1,
				// 		'notes.messages._id': 1,
				// 		'notes.messages.approved': 1,
				// 		'notes.messages.formalized': 1,
				// 		'notes.messages.message': 1,
				// 		'notes.messages.owner._id': 1,
				// 		'notes.messages.owner.alias': 1,
				// 		'notes.messages.owner.name': 1,
				// 		'notes.messages.owner.lastName': 1,
				// 		'notes.messages.owner.ref': 1,
				// 		'notes.messages.owner.documents': 1,
				// 		'notes.messages.owner.updateLimitDate': 1,
				// 		'notes.messages.owner.createdAt': 1,
				// 		'notes.messages.owner.updatedAt': 1,
				// 		'notes.updateLimitDate': 1,
				// 		'notes.createdAt': 1,
				// 		'notes.updatedAt': 1,
				// 		'notes.clientAlias': 1,
				// 		'notes.clientId': 1,
				// 		'notes.projects._id': 1,
				// 		'notes.projects.alias': 1,
				// 		'notes.projects.date': 1,
				// 		'notes.projects.ref': 1,
				// 		'notes.projects.closed': 1,
				// 		'notes.testSystems._id': 1,
				// 		'notes.testSystems.vtiCode': 1,
				// 		'notes.testSystems.alias': 1,
				// 		'notes.testSystems.ref': 1,
				// 		'notes.isAnswered': 1,
				// 		'notes.isDocuments': 1
				// 	}
				// }
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
	query?: QueryString.ParsedQs
): Promise<T[]> => {
	const searchField = group.split('.');
	searchField.splice(-1);
	const transformQueryToArray = query
		? Object.entries(query!).map(([key, value]) => {
				if (Array.isArray(value)) {
					return {
						$and: value.map((v) => ({
							[key]: key.includes('_id')
								? Types.ObjectId(v as string)
								: v === 'true'
								? true
								: { $regex: v, $options: 'i' }
						}))
					};
				}
				return {
					[key]: key.includes('_id')
						? Types.ObjectId(value as string)
						: value === 'true'
						? true
						: { $regex: value, $options: 'i' }
				};
		  })
		: [];
	const transformQuery =
		transformQueryToArray.length > 0
			? {
					$or: transformQueryToArray
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
					}
				}
			}
		);
		if (!options?.populate) {
			pipeline.push({
				$lookup: {
					from: 'tagnotes',
					localField: 'notes.tags',
					foreignField: '_id',
					as: 'notes.tags'
				}
			});
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
					}
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
			}
		);
	}

	pipeline.push(
		{
			$unwind: `$${field}`
		},
		{
			$match: transformQuery || {}
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
