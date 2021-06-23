import { Request, Response, NextFunction } from 'express';
import { createNote } from '../services/note.service';

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
