import { Request, Response, NextFunction } from 'express';
import { createMessage, createNote } from '../services/note.service';

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
