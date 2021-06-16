import { FilterQuery } from 'mongoose';
import { Pagination } from '../interfaces/config.interface';
import { IClient, IClientModel } from '../interfaces/models.interface';
import { ClientModel } from '../models/client.model';

export const findTestSystem = async (
	{
		match,
		querys,
		_extends,
		nameFild,
		group
	}: {
		match?: string;
		nameFild: string;
		querys: FilterQuery<IClientModel>;
		_extends?: string;
		group?: string;
	},
	pagination: Pagination,
	order?: { [key: string]: -1 | 1 }
): Promise<{ _id: string; testSystem: IClient }[]> => {
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

	if (pagination.limit > 0) {
		pipeline.push({
			$limit: pagination.limit
		});
	}
	if (pagination.offset > 0) {
		pipeline.push({
			$skip: pagination.offset
		});
	}

	if (_extends) {
		pipeline.push({
			$addFields: {
				[nameFild]: `$${_extends}`
			}
		});
		if (group && !order) {
			pipeline.push({
				$sort: { 'notes.title': 1 }
			});
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

	return await ClientModel.aggregate(pipeline);
};
