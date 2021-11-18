/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	TGroupPopulateAggregate,
	TLookupPopulateAggrefate,
	TReplaceRootPopulateAggregate,
	TUnwindPopulateAggregate
} from '../interfaces/aggregate.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
	const unwind2 = { $unwind: `$${field}.tags` };

	const lookup2: TLookupPopulateAggrefate = {
		$lookup: {
			from: searchModel,
			localField: `${searchField}.relatedTags`,
			foreignField: '_id',
			as: `${searchField}.relatedTags`
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

	return [unwind, lookup, unwind2, lookup2, group, replaceRoot];
};

export const findKey = (value: string, real?: boolean): string => {
	return real ? value : value.match(/^\d/) ? '0-9' : (value[0] as string).toUpperCase();
};

export const addGroup = (
	aux: { alias: string; clientAlias: string },
	property: { [key: string]: { alias: string; clientAlias: string }[] },
	key: string
): void => {
	if (property[key]) {
		if (!property[key].find((group) => group.alias && group.alias === aux.alias))
			property[key].push(aux);
	} else {
		property[key] = [aux];
	}
};

const orders = {
	notes: 'title',
	projects: 'alias',
	testSystems: 'alias'
};

export const groupAggregate = <T, G extends string>(
	properties: any[],
	{ group, field, real }: { group: G; field: string; real?: boolean }
): T[] => {
	const obj = properties.reduce((projectsGroup, { aux }) => {
		const valueGroup = group.split('.'); // .filter((property) => property !== field);
		let value = valueGroup.reduce((field, property) => {
			if (field) {
				return (field as unknown as { [key: string]: string })?.[property];
			}
			return aux[property] || (field as unknown as { [key: string]: string })?.[property];
		}, '');
		let key = findKey(value, real);
		addGroup(aux, projectsGroup, key);
		if (aux?.tags?.relatedTags) {
			for (const tag of aux.tags.relatedTags) {
				value = tag.name;
				key = findKey(value, real);
				addGroup(aux, projectsGroup, key);
			}
		}
		return projectsGroup;
	}, {} as { [key: string]: T[] });
	const order = Object.keys(obj).sort((keyA, keyB) => keyA.localeCompare(keyB));
	const fieldOrder = orders[field as 'notes'];
	const newObj = order.reduce((acc, key) => {
		acc[key] = obj[key].sort((keyA: { title: string }, keyB: { title: string }) =>
			keyA[fieldOrder as 'title'].localeCompare(keyB[fieldOrder as 'title'])
		);
		return acc;
	}, {} as { [key: string]: T[] });
	return newObj as any;
};
