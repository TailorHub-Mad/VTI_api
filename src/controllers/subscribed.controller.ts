import {
	SUBSCRIBED_NOTE,
	SUBSCRIBED_NOTE_POPULATE,
	SUBSCRIBED_PROJECT,
	SUBSCRIBED_PROJECT_POPULATE,
	SUBSCRIBED_TESTSYSTEM,
	SUBSCRIBED_TESTSYSTEM_POPULATE
} from '@constants/subscribed.constanst';
import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model';

export const GetAllSubscribed = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		let users = await UserModel.aggregate([
			...SUBSCRIBED_PROJECT,
			...SUBSCRIBED_TESTSYSTEM,
			...SUBSCRIBED_NOTE
		]);
		users = users.filter((user) => {
			return (
				user.subscribed.notes.length > 0 ||
				user.subscribed.projects.length > 0 ||
				user.subscribed.testSystems.length > 0
			);
		});
		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
};
export const GetNotesSubscribed = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const users = await UserModel.aggregate([...SUBSCRIBED_NOTE_POPULATE]);
		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
};
export const GetProjectsSubscribed = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const users = await UserModel.aggregate([...SUBSCRIBED_PROJECT_POPULATE]);
		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
};
export const GetTestSystemsSubscribed = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const users = await UserModel.aggregate([...SUBSCRIBED_TESTSYSTEM_POPULATE]);
		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
};
