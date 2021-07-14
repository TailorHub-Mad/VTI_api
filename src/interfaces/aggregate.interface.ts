export type TUnwindPopulateAggregate = {
	$unwind: string;
};

export type TLookupPopulateAggrefate = {
	$lookup: {
		from: string;
		localField: string;
		foreignField: '_id';
		as: string;
	};
};

type T_idGroup = '$_id';
type TOldGroup = { $first: '$$ROOT' };

export type TGroupPopulateAggregate = {
	$group: {
		_id: T_idGroup;
		old: TOldGroup;
		[key: string]:
			| {
					$push: string;
			  }
			| T_idGroup
			| TOldGroup;
	};
};

export type TReplaceRootPopulateAggregate = {
	$replaceRoot: {
		newRoot: {
			$mergeObjects: ['$old', { [key: string]: string }];
		};
	};
};

export interface IPopulateGroup {
	field: string;
	property: string;
}
