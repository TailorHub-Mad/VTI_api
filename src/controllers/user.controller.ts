import { NotFoundError } from '@errors/not_found.error';
import { getPagination } from '@utils/controllers.utils';
import { Request, Response, NextFunction } from 'express';
import {
	filterUser,
	getActiveNote,
	getFavoriteNotes,
	getNotRead,
	getSubscribersNotes,
	getFavoriteProjects,
	getSubscribersProjects,
	recovery,
	resetPassword
} from '../services/user.service';
import { IUserDocument } from '../interfaces/models.interface';
import { UserModel } from '../models/user.model';
import { read } from '../services/crud.service';

export const getProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { user } = req;
		if (user) {
			const userFind = (
				await read<IUserDocument>(UserModel, { _id: user.id }, getPagination(req.query))
			)[0].toObject();
			res.status(200).json([{ role: user.role, ...userFind }]);
		} else {
			throw new NotFoundError();
		}
	} catch (err) {
		next(err);
	}
};

export const ResetPassword = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		await resetPassword(req.body, Boolean(req.query.isRecovery as string));
		res.sendStatus(202);
	} catch (err) {
		next(err);
	}
};

export const Recovery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		await recovery(req.body);
		res.sendStatus(202);
	} catch (err) {
		next(err);
	}
};

export const GetFavoritesNotes = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const notes = await getFavoriteNotes(req.user);
		res.status(200).json(notes);
	} catch (err) {
		next(err);
	}
};

export const GetSubscribersNotes = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const notes = await getSubscribersNotes(req.user);
		res.status(200).json(notes);
	} catch (err) {
		next(err);
	}
};
export const GetFavoritesProjects = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const notes = await getFavoriteProjects(req.user);
		res.status(200).json(notes);
	} catch (err) {
		next(err);
	}
};

export const GetSubscribersProjects = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const notes = await getSubscribersProjects(req.user);
		res.status(200).json(notes);
	} catch (err) {
		next(err);
	}
};

export const GetActiveNote = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const notes = await getActiveNote(req.user);
		res.status(200).json(notes);
	} catch (err) {
		next(err);
	}
};

export const GetNoRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const notes = await getNotRead(req.user);
		res.status(200).json(notes);
	} catch (err) {
		next(err);
	}
};

export const FilterUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const users = await filterUser(req.query);
		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
};
