import {
	createMessageNoteValidation,
	createNoteValidation,
	updateNoteValidationAdmin,
	updateMessageNoteValidation,
	groupNotesValidation
} from '../validations/note.validation';
import {
	IClientDocument,
	IMessage,
	INote,
	INoteDocument,
	IReqUser
} from '../interfaces/models.interface';
import { read } from './crud.service';
import { ClientModel } from '../models/client.model';
import { BaseError } from '@errors/base.error';
import { getPagination } from '@utils/controllers.utils';
import { createSet, transformStringToObjectId } from '@utils/model.utils';
import { updateRepository } from '../repositories/common.repository';
import { mongoIdValidation } from '../validations/common.validation';
import { MessageModel } from '../models/message.model';
import { GROUP_NOTES } from '@constants/group.constans';
import QueryString from 'qs';
import { groupRepository } from 'src/repositories/aggregate.repository';

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

export const createMessage = async (
	note: string,
	body: Partial<INote>,
	user: IReqUser
): Promise<void> => {
	const validateBody = await createMessageNoteValidation.validateAsync(body);
	const validateIdNote = await mongoIdValidation.validateAsync(note);
	validateBody.owner = user.id;
	const message = new MessageModel(validateBody);
	const client = await updateRepository<IClientDocument>(
		ClientModel,
		{ 'notes._id': validateIdNote },
		{ $push: { 'notes.$.messages': message } }
	);
	await client?.save();
	const _note = client?.notes.find(({ _id }) => _id.toString() === note);
	logger.notice(
		`El usuario ${user.email} ha creado el mensaje con title ${validateBody.message} en el apunte ${_note?.title}`,
		{ name: 'test' }
	);
};

export const updateNote = async (note_id: string, body: Partial<INote>): Promise<void> => {
	const validateBody = await updateNoteValidationAdmin.validateAsync(body);
	const validateIdNote = await mongoIdValidation.validateAsync(note_id);

	const updated = createSet(validateBody, 'notes.$');

	await updateRepository<IClientDocument>(ClientModel, { 'notes._id': validateIdNote }, updated);
};

export const updateMessage = async (message_id: string, body: Partial<IMessage>): Promise<void> => {
	const validateBody = await updateMessageNoteValidation.validateAsync(body);
	const validateIdNote = await mongoIdValidation.validateAsync(message_id);

	const updated = createSet(validateBody, 'notes.$.messages.$[message]');
	await updateRepository<IClientDocument>(
		ClientModel,
		{ 'notes.messages._id': validateIdNote },
		{ $set: updated },
		{ arrayFilters: [{ 'message._id': validateIdNote }] }
	);
};

export const groupNotes = async (query: QueryString.ParsedQs): Promise<INote[]> => {
	const queryValid = await groupNotesValidation.validateAsync(query);
	const notes = await groupRepository<INote, typeof GROUP_NOTES[number]>(queryValid.group, 'notes');
	return notes;
};
