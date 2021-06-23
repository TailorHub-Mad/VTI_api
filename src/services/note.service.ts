import { createNoteValidation } from '../validations/note.validation';
import { IClientDocument, INote, INoteDocument } from '../interfaces/models.interface';
import { read } from './crud.service';
import { ClientModel } from '../models/client.model';
import { BaseError } from '@errors/base.error';
import { getPagination } from '@utils/controllers.utils';
import { transformStringToObjectId } from '@utils/model.utils';

export const createNote = async (body: Partial<INote>): Promise<void> => {
	const validateBody = await createNoteValidation.validateAsync(body);
	const { title, description, link = null, project, testSystems } = validateBody;

	const client = (
		await read<IClientDocument>(
			ClientModel,
			{
				'projects._id': validateBody.project
			},
			getPagination()
		)
	)[0];

	if (!client) throw new BaseError('Not found project');

	client.notes.push({ title, description, link });
	const newClient = await client.save();
	const note: INoteDocument = newClient.notes.find((note) => note.title === title);
	const projectId = transformStringToObjectId(project);

	newClient.projects = newClient.projects.map((project) => {
		if (project._id.equals(projectId)) {
			project.notes.push(note._id);
		}
		return project;
	});

	newClient.testSystem = client.testSystem.map((testSystem) => {
		if ((testSystems || []).includes(testSystem._id.toString())) {
			testSystem.notes.push(note._id);
		}
		return testSystem;
	});
	await newClient.save();
};

// export const updateNote = async ( note: string, body: Partial<>)
