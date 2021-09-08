import { GROUP_PROJECT } from '@constants/group.constans';
import { IProjects } from '../interfaces/models.interface';
import { ClientModel } from '../models/client.model';

export const checkAlias = async (
	alias: string,
	{ id_client, id_project }: { id_client?: string; id_project?: string }
): Promise<boolean | undefined> => {
	const client = await ClientModel.findOne({ 'projects.alias': alias });
	if (!client) return false;
	if (id_client) {
		return id_client === client._id.toString();
	}
	if (id_project) {
		const project = client.projects.find((project) => project._id.toString() === id_project);
		return project?.alias !== alias;
	}
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
