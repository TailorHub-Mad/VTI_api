import { Request, Response, NextFunction } from 'express';
import { createMessage, createNote, updateMessage, updateNote } from '../services/note.service';

export const CreateNote = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { body } = req;
		await createNote(body);
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
		const { body, params } = req;
		const { id } = params;
		await updateNote(id, body);
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
