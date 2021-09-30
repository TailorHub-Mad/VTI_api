import { Request, Response, NextFunction } from 'express';
import {
	createMessage,
	createNote,
	deleteMessage,
	deleteNote,
	downloadDocument,
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
		await createNote(body, files as Express.Multer.File[] | undefined);
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
		const { body, params, user } = req;
		const { id } = params;
		await createMessage(id, body, user);
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
		const { body, params, user } = req;
		const { id } = params;
		await updateMessage(id, body);
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
