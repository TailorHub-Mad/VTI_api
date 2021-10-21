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
	IReqUser,
	IUserDocument
} from '../interfaces/models.interface';
import { read } from './crud.service';
import { ClientModel } from '../models/client.model';
import { BaseError } from '@errors/base.error';
import { getPagination } from '@utils/controllers.utils';
import {
	addToSetTags,
	createRef,
	createSet,
	transformStringToObjectId,
	updateTags
} from '@utils/model.utils';
import { findOneRepository, updateRepository } from '../repositories/common.repository';
import { mongoIdValidation } from '../validations/common.validation';
import { MessageModel } from '../models/message.model';
import { GROUP_NOTES } from '@constants/group.constans';
import QueryString from 'qs';
import { groupRepository } from '../repositories/aggregate.repository';
import { IPopulateGroup } from '../interfaces/aggregate.interface';
import { Model, Types } from 'mongoose';
import { UserModel } from '../models/user.model';
import { TagNoteModel } from '../models/tag_notes.model';
import { deleteModelInClientRepository } from '../repositories/client.repository';

export const createNote = async (
	body: Partial<INote>,
	files?: Express.Multer.File[]
): Promise<{ noteId: string; isClosed: boolean }> => {
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

	const newRef = await createRef('notes');

	client.notes.push({ title, description, link, tags, documents, ref: newRef });
	const newClient = await client.save();
	const note: INoteDocument = newClient.notes.find((note) => note.title === title);
	const projectId = transformStringToObjectId(project);

	addToSetTags(
		note,
		{
			field: 'notes',
			property: 'title',
			model: TagNoteModel as unknown as Model<INoteDocument>
		},
		validateBody.tags
	);
	let isClosed = false;
	newClient.projects = newClient.projects.map((project) => {
		if (project._id.equals(projectId)) {
			project.notes.push(note._id);
			isClosed = project.closed?.year;
		}
		return project;
	});

	newClient.testSystems = client.testSystems.map((testSystem) => {
		if ((testSystems || []).includes(testSystem._id.toString())) {
			testSystem.notes.push(note._id);
		}
		return testSystem;
	});
	await newClient.save();
	return { noteId: note._id, isClosed };
};

export const createMessage = async (
	note: string,
	body: Partial<INote>,
	user: IReqUser,
	files?: Express.Multer.File[]
): Promise<{ title: string; project: string; noteId: string }> => {
	const validateBody = await createMessageNoteValidation.validateAsync(body);
	const validateIdNote = await mongoIdValidation.validateAsync(note);
	validateBody.owner = user.id;
	let documents: { url: string; name: string }[] = [];
	if (files) {
		documents = files.map((file: Express.Multer.File) => ({
			url: file.path,
			name: file.fieldname
		}));
	}
	validateBody.documents = documents;
	const message = new MessageModel(validateBody);
	const client = await updateRepository<IClientDocument>(
		ClientModel,
		{ 'notes._id': validateIdNote },
		{ $push: { 'notes.$.messages': message } }
	);
	await client?.save();
	const _note = client?.notes.find(({ _id }) => _id.toString() === note);
	const project = client?.projects.find(({ notes }) => notes.includes(new Types.ObjectId(note)));
	if (project) {
		updateRepository<IUserDocument>(
			UserModel,
			{ _id: user.id },
			{ $addToSet: { projectsComments: project.alias } }
		);
	}

	logger.notice(
		`El usuario ${user.email} ha creado el mensaje con title ${validateBody.message} en el apunte ${_note?.title}`
	);
	return { title: _note.title, noteId: _note._id, project: project._id };
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
	const client = await updateRepository<IClientDocument>(
		ClientModel,
		{ 'notes._id': validateIdNote },
		updated
	);
	const _note = client?.notes.find(({ _id }) => _id.toString() === validateIdNote);
	await updateTags(_note, validateBody.tags, {
		field: 'notes',
		property: 'title',
		model: TagNoteModel
	});
};

export const updateMessage = async (
	message_id: string,
	body: Partial<IMessage>,
	files?: Express.Multer.File[]
): Promise<{
	titleNote: string;
	idNote: string;
	idProject: string;
	formalizedMessage?: string;
	approvedMessage?: string;
} | void> => {
	if (files) {
		body.documents = (body.documents || []).concat(
			files.map((file: Express.Multer.File) => ({
				url: file.path,
				name: file.fieldname
			}))
		);
	}
	const validateBody = await updateMessageNoteValidation.validateAsync(body);
	const validateIdNote = await mongoIdValidation.validateAsync(message_id);

	const updated = createSet(validateBody, 'notes.$.messages.$[message]');
	const client = await updateRepository<IClientDocument>(
		ClientModel,
		{ 'notes.messages._id': validateIdNote },
		{ $set: updated },
		{ arrayFilters: [{ 'message._id': validateIdNote }], new: false }
	);
	if (client) {
		const _note = client.notes.find((note) =>
			note.messages.find((message: { _id: string }) => message._id.toString() === message_id)
		);
		if (_note) {
			const message: { formalized?: string; approved?: string } = _note.messages.find(
				(message: { _id: string }) => message._id.toString() === message_id
			);
			const project = client?.projects.find(({ notes }) =>
				notes.includes(new Types.ObjectId(_note._id))
			);
			return {
				titleNote: _note.title,
				idNote: _note._id,
				idProject: project?._id,
				formalizedMessage: message?.formalized,
				approvedMessage: message?.approved
			};
		}
	}
};

export const groupNotes = async (query: QueryString.ParsedQs): Promise<INote[]> => {
	const group = { group: query.group, real: query.real };
	delete query.group;
	delete query.real;
	const queryValid = await groupNotesValidation.validateAsync(group);
	let populate: IPopulateGroup | undefined;
	if (queryValid.group.includes('tags')) {
		queryValid.group = 'notes.tags.name';
		populate = { field: 'tagnotes', property: 'tags' };
	}
	if (queryValid.group === 'sector') {
		queryValid.group = 'notes.projects.0.sector.0.title';
	}
	if (queryValid.group === 'alias') {
		queryValid.group = 'notes.projects.0.alias';
	}
	if (queryValid.group === 'year') {
		queryValid.group = 'notes.year';
	}
	const notes = await groupRepository<INote, typeof GROUP_NOTES[number]>(
		queryValid.group,
		'notes',
		{ real: queryValid.real, populate },
		query
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

export const downloadDocumentMessage = async (id_document: string): Promise<string> => {
	const validateIdDocument = await mongoIdValidation.validateAsync(id_document);
	const client = await findOneRepository<IClientDocument>(
		ClientModel,
		{ 'notes.messages.documents._id': validateIdDocument },
		{
			_id: 0,
			notes: {
				$elemMatch: {
					messages: { $elemMatch: { documents: { $elemMatch: { _id: validateIdDocument } } } }
				}
			}
		}
	);
	if (!client) {
		throw new BaseError('Missing Document');
	}
	const note: INote = client.notes[0];

	const url = note.messages.reduce((url, message) => {
		const urlFind = message.documents.find(
			(document: { _id: string }) => document._id?.toString() === id_document
		);
		if (urlFind) {
			return urlFind;
		}
		return url;
	}, {});

	if (!url) {
		throw new BaseError('Missing Document');
	}
	return url.url;
};

export const deleteNote = async (id_note: string): Promise<void> => {
	const noteIdValidation = await mongoIdValidation.validateAsync(id_note);

	await deleteModelInClientRepository('notes', noteIdValidation);
};

export const deleteMessage = async (id_note: string, id_message: string): Promise<void> => {
	const noteIdValidation = await mongoIdValidation.validateAsync(id_note);
	const messageIdValidation = await mongoIdValidation.validateAsync(id_message);
	const client = (
		await read<IClientDocument>(
			ClientModel,
			{ 'notes._id': noteIdValidation },
			{ limit: 1, offset: 0 }
		)
	)[0];
	if (client) {
		const notes: INoteDocument = client.notes.find(
			(note) => note._id.toString() === noteIdValidation
		);
		if (notes) {
			const messages = notes.messages.filter(
				(message) => message._id.toString() !== messageIdValidation
			);
			notes.messages = messages;
			await client.save();
		}
	}
};
