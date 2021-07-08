import {
	TGroupPopulateAggregate,
	TLookupPopulateAggrefate,
	TReplaceRootPopulateAggregate,
	TUnwindPopulateAggregate
} from 'src/interfaces/aggregate.interface';

export const groupByAlphanumeric = <T extends { aux: any }>(
	documents: T[],
	group: string
): { [key: string]: T[] } => {
	return documents.reduce((docuemntsGroup, { aux }) => {
		const key = aux[group].match(/^\d/) ? '0-9' : (aux[group][0] as string).toUpperCase();
		if (docuemntsGroup[key]) {
			docuemntsGroup[key].push(aux);
		} else {
			docuemntsGroup[key] = [aux];
		}
		return docuemntsGroup;
	}, {} as { [key: string]: T[] });
};

export const populateAggregate = (
	field: string,
	populate: { searchModel: string; searchField: string }
): [
	TUnwindPopulateAggregate,
	TLookupPopulateAggrefate,
	TGroupPopulateAggregate,
	TReplaceRootPopulateAggregate
] => {
	const { searchModel, searchField } = populate;
	const unwind = { $unwind: `$${field}` };
	const lookup: TLookupPopulateAggrefate = {
		$lookup: {
			from: searchModel,
			localField: searchField,
			foreignField: '_id',
			as: searchField
		}
	};
	const group: TGroupPopulateAggregate = {
		$group: {
			_id: '$_id',
			old: { $first: '$$ROOT' },
			[field]: {
				$push: `$${field}`
			}
		}
	};
	const replaceRoot: TReplaceRootPopulateAggregate = {
		$replaceRoot: { newRoot: { $mergeObjects: ['$old', { [field]: `$${field}` }] } }
	};

	return [unwind, lookup, group, replaceRoot];
};
