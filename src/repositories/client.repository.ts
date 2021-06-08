import { ITestSystem } from '../interfaces/models.interface';
import { ClientModel } from '../models/client.model';

export const findTestSystem = async (find: {
	[key: string]: (string | number)[];
}): Promise<{ _id: string; testSystem: ITestSystem }[]> => {
	const transformArray = Object.entries(find);
	const filter = transformArray.reduce(
		(filter, [key, value]) => {
			const name = '$' + value[0];
			const find = value[1];
			filter.match.push({ [key]: [name, find] });
			filter.project.push({ [key]: ['$' + name, find] });
			return filter;
		},
		{ match: [], project: [] } as {
			match: { [key: string]: (string | number)[] }[];
			project: { [key: string]: (string | number)[] }[];
		}
	);
	return await ClientModel.aggregate([
		// {
		// 	$match: {
		// 		$expr: {
		// 			$and: filter.match
		// 		}
		// 	}
		// }
		{
			$project: {
				alias: 1,
				testSystem: {
					$filter: {
						input: '$testSystem',
						as: 'testSystem',
						cond: {
							$and: filter.project
						}
					}
				}
			}
		}
	]);
};
