import { Request, Response, NextFunction } from 'express';
import {
	createMessage,
	createNote,
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
		const { body, files } = req;
		console.log(req);
		await createNote(body, files as Express.Multer.File[] | undefined);
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
		const { body, params, files } = req;
		const { id } = params;
		await updateNote(id, body, files as Express.Multer.File[] | undefined);
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
		const { body, params } = req;
		const { id } = params;
		await updateMessage(id, body);
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
		res.download(document);
	} catch (err) {
		next(err);
	}
};
