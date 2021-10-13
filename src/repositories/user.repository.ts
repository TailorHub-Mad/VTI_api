import { Types } from 'mongoose';
import { UserModel } from '../models/user.model';
import QueryString from 'qs';
import { IUserDocument } from 'src/interfaces/models.interface';

export const userFilterAggregate = async (
	query: QueryString.ParsedQs
): Promise<IUserDocument[]> => {
	const union = query.union ? '$and' : '$or';
	delete query.union;
	const transformQueryToArray = Object.entries(query).map(([key, value]) => {
		if (Array.isArray(value)) {
			if (key.match(/\.createdAt$/)) {
				return {
					$or: value.map((t) => {
						const time = (t as string).split(';');
						return {
							$and: [
								{
									[key]: { $gte: new Date(time[0]) }
								},
								{
									[key]: { $lte: new Date(time[1]) }
								}
							]
						};
					})
				};
			}
			return {
				$and: value.map((v) => ({
					[key]: key.includes('_id')
						? Types.ObjectId(v as string)
						: v === 'true'
						? true
						: { $regex: v, $options: 'i' }
				}))
			};
		} else if (key.match(/\.createdAt$/)) {
			const time = (value as string).split(';');
			return {
				$and: [
					{
						[key]: { $gte: new Date(time[0]) }
					},
					{
						[key]: { $lte: new Date(time[1]) }
					}
				]
			};
		}
		return {
			[key]:
				key.includes('_id') || key.includes('clientId')
					? Types.ObjectId(value as string)
					: value === 'true'
					? true
					: { $regex: value, $options: 'i' }
		};
	});

	const transformQuery =
		transformQueryToArray.length > 0
			? {
					[union]: transformQueryToArray
			  }
			: {};
	const pipeline = [
		{
			$unwind: {
				path: '$focusPoint',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$lookup: {
				from: 'clients',
				let: {
					aliasProject: '$focusPoint'
				},
				pipeline: [
					{
						$unwind: {
							path: '$projects'
						}
					},
					{
						$match: {
							$expr: {
								$eq: ['$projects.alias', '$$aliasProject']
							}
						}
					},
					{
						$replaceRoot: {
							newRoot: {
								$mergeObjects: ['$projects']
							}
						}
					}
				],
				as: 'focusPoint'
			}
		},
		{
			$addFields: {
				focusPoint: { $first: '$focusPoint' }
			}
		},
		{
			$group: {
				_id: '$_id',
				user: {
					$first: '$$ROOT'
				},
				focusPoint: {
					$push: '$focusPoint'
				}
			}
		},
		{
			$replaceRoot: {
				newRoot: { $mergeObjects: ['$user', { focusPoint: '$focusPoint' }] }
			}
		},
		{
			$unwind: {
				path: '$projectsComments',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$lookup: {
				from: 'clients',
				let: {
					aliasProject: '$projectsComments'
				},
				pipeline: [
					{
						$unwind: {
							path: '$projects'
						}
					},
					{
						$match: {
							$expr: {
								$eq: ['$projects.alias', '$$aliasProject']
							}
						}
					},
					{
						$replaceRoot: {
							newRoot: {
								$mergeObjects: ['$projects']
							}
						}
					}
				],
				as: 'projectsComments'
			}
		},
		{
			$addFields: {
				projectsComments: { $first: '$projectsComments' }
			}
		},
		{
			$group: {
				_id: '$_id',
				user: {
					$first: '$$ROOT'
				},
				projectsComments: {
					$push: '$projectsComments'
				}
			}
		},
		{
			$replaceRoot: {
				newRoot: { $mergeObjects: ['$user', { projectsComments: '$projectsComments' }] }
			}
		},
		{
			$lookup: {
				from: 'departments',
				localField: 'department',
				foreignField: '_id',
				as: 'department'
			}
		},
		{
			$addFields: {
				department: { $first: '$department' }
			}
		},
		{
			$match: transformQuery
		}
	];
	const user = await UserModel.aggregate(pipeline);
	return user;
};
