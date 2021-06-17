import { FilterQuery } from 'mongoose';
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
	pagination: Pagination,
	order?: { [key: string]: -1 | 1 }
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

	return await ClientModel.aggregate(pipeline);
};
