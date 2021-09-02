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
import { findOneRepository, updateRepository } from '../repositories/common.repository';
import { mongoIdValidation } from '../validations/common.validation';
import { MessageModel } from '../models/message.model';
import { GROUP_NOTES } from '@constants/group.constans';
import QueryString from 'qs';
import { groupRepository } from 'src/repositories/aggregate.repository';
import { IPopulateGroup } from 'src/interfaces/aggregate.interface';

export const createNote = async (
	body: Partial<INote>,
	files?: Express.Multer.File[]
): Promise<void> => {
	if (!Array.isArray(body.testSystems)) {
		body.testSystems = [body.testSystems];
	}
	if (!Array.isArray(body.tags)) {
		body.tags = [body.tags];
	}
	const validateBody = await createNoteValidation.validateAsync(body);
	const { title, description, link = null, project, testSystems, tags } = validateBody;
	let documents: { url: string; name: string }[] = [];
	if (files) {
		documents = files.map((file: Express.Multer.File) => ({
			url: file.path,
			name: file.fieldname
		}));
	}
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

	client.notes.push({ title, description, link, tags, documents });
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

export const updateNote = async (
	note_id: string,
	body: Partial<INote>,
	files?: Express.Multer.File[]
): Promise<void> => {
	if (body.testSystems && !Array.isArray(body.testSystems)) {
		body.testSystems = [body.testSystems];
	}
	if (body.tags && !Array.isArray(body.tags)) {
		body.tags = [body.tags];
	}
	if (files) {
		body.documents = (body.documents || []).concat(
			files.map((file: Express.Multer.File) => ({
				url: file.path,
				name: file.fieldname
			}))
		);
	}
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
	let populate: IPopulateGroup | undefined;
	if (queryValid.group.includes('tags')) {
		queryValid.group = 'notes.tags.name';
		populate = { field: 'tagnotes', property: 'tags' };
	}
	const notes = await groupRepository<INote, typeof GROUP_NOTES[number]>(
		queryValid.group,
		'notes',
		{ real: queryValid.real, populate }
	);
	return notes;
};

export const downloadDocument = async (id_document: string): Promise<string> => {
	const validateIdDocument = await mongoIdValidation.validateAsync(id_document);
	const client = await findOneRepository<IClientDocument>(
		ClientModel,
		{ 'notes.documents._id': validateIdDocument },
		{ _id: 0, notes: { $elemMatch: { documents: { $elemMatch: { _id: validateIdDocument } } } } }
	);
	if (!client) {
		throw new BaseError('Missing Document');
	}
	const note: INote = client.notes[0];

	const url = note.documents.find((document) => document._id?.toString() === id_document);

	if (!url) {
		throw new BaseError('Missing Document');
	}
	return url.url;
};
