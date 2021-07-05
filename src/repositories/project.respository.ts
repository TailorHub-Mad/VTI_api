import { GROUP_PROJECT } from '@constants/group.constans';
import { IClientDocument, IProjects } from '../interfaces/models.interface';
import { ClientModel } from '../models/client.model';

export const checkAlias = async (alias: string): Promise<IClientDocument | null> => {
	const client = await ClientModel.findOne({ 'projects.alias': alias });
	return client;
};

export const groupProjectRepository = async (
	group: typeof GROUP_PROJECT[number]
): Promise<IProjects[]> => {
	const projects = await ClientModel.aggregate([
		{
			$unwind: '$projects'
		},
		{
			$project: {
				_id: 0,
				project: '$projects'
			}
		}
	])
		.sort({ [`project.${group}`]: 1 })
		.collation({
			locale: 'es',
			numericOrdering: true
		})
		.limit(10)
		.skip(0);
	return projects.reduce((projectsGroup, { project }) => {
		const key = project.alias.match(/^\d/) ? '0-9' : (project.alias[0] as string).toUpperCase();
		if (projectsGroup[key]) {
			projectsGroup[key].push(project);
		} else {
			projectsGroup[key] = [project];
		}
		return projectsGroup;
	}, {} as { [key: string]: IProjects[] });
};
