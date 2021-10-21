import {
	ANSWER_NOTE,
	CREATED_NOTE,
	NOTES_NOTIFICATION,
	UPDATE_MESSAGE
} from '@constants/notification.constants';
import { Request, Response, NextFunction } from 'express';
import { createNotification, extendNotification } from '../services/notification.service';
import {
	createMessage,
	createNote,
	deleteMessage,
	deleteNote,
	downloadDocument,
	downloadDocumentMessage,
	groupNotes,
	updateMessage,
	updateNote
} from '../services/note.service';

export const CreateNote = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { body, files, user } = req;
		const noteId = await createNote(body, files as Express.Multer.File[] | undefined);
		const notification = await createNotification(user, {
			description: `Se ha creado un nuevo ${NOTES_NOTIFICATION.label}`,
			urls: [
				{
					label: body.title || NOTES_NOTIFICATION.label,
					model: NOTES_NOTIFICATION.model,
					id: noteId
				}
			],
			type: CREATED_NOTE
		});
		await extendNotification({ field: NOTES_NOTIFICATION.model, id: noteId }, notification, true);
		logger.notice(`El usuario ${user.email} ha creado un apunte con título ${body.title}`);
		res.sendStatus(201);
	} catch (err) {
		next(err);
	}
};

export const CreateMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { body, params, user, files } = req;
		const { id } = params;
		const titleNote = await createMessage(
			id,
			body,
			user,
			files as Express.Multer.File[] | undefined
		);
		const notification = await createNotification(user, {
			description: `Se ha creado un nuevo mensaje en el apunte ${NOTES_NOTIFICATION.label}`,
			urls: [
				{
					label: titleNote || NOTES_NOTIFICATION.label,
					model: NOTES_NOTIFICATION.model,
					id: id
				}
			],
			type: ANSWER_NOTE
		});
		await extendNotification({ field: NOTES_NOTIFICATION.model, id }, notification);
		logger.notice(
			`El usuario ${user.email} ha creado el mensaje con title ${body.message} en el apunte con la id ${id}`
		);
		res.sendStatus(201);
	} catch (err) {
		next(err);
	}
};

export const UpdateNote = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { body, params, files, user } = req;
		const { id } = params;
		await updateNote(id, body, files as Express.Multer.File[] | undefined);

		logger.notice(`El usuario ${user.email} ha modificado un apunte con título ${body.title}`);
		res.sendStatus(200);
	} catch (err) {
		next(err);
	}
};

export const UpdateMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { body, params, user, files } = req;
		const { id } = params;
		const titleMessage = await updateMessage(id, body, files as Express.Multer.File[] | undefined);
		const notification = await createNotification(user, {
			description: `Se ha modificado un mensaje en el ${NOTES_NOTIFICATION.label}`,
			urls: [
				{
					label: titleMessage || NOTES_NOTIFICATION.label,
					model: NOTES_NOTIFICATION.model,
					id: id
				}
			],
			type: UPDATE_MESSAGE
		});
		await extendNotification({ field: NOTES_NOTIFICATION.model, id }, notification);
		logger.notice(
			`El usuario ${user.email} ha modificado un mensaje con título ${body.message} en el apunte con la id ${id}`
		);
		res.sendStatus(200);
	} catch (err) {
		next(err);
	}
};

export const GroupNotes = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const notes = await groupNotes(req.query);
		res.json(notes);
	} catch (err) {
		next(err);
	}
};

export const DownloadDocumentNote = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const document = await downloadDocument(req.params.document);
		const user = req.user;
		logger.notice(`El usuario ${user.email} se ha descargado el archivo ${document}`);
		res.download(document);
	} catch (err) {
		next(err);
	}
};

export const DownloadDocumentMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const document = await downloadDocumentMessage(req.params.document);
		const user = req.user;
		logger.notice(`El usuario ${user.email} se ha descargado el archivo ${document}`);
		res.download(document);
	} catch (err) {
		next(err);
	}
};

export const DeleteNote = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { user } = req;
		const { id_note } = req.params;
		await deleteNote(id_note);
		logger.notice(`El usuario ${user.email} ha eliminado una nota con el id ${id_note}`);
		res.sendStatus(200);
	} catch (err) {
		next(err);
	}
};

export const DeleteMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { user } = req;
		const { id_note, id_message } = req.params;
		await deleteMessage(id_note, id_message);
		logger.notice(`El usuario ${user.email} ha eliminado un mensaje con el id ${id_message}`);
		res.sendStatus(200);
	} catch (err) {
		next(err);
	}
};
