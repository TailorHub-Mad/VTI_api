import { Request, Response, NextFunction } from 'express';
import {
	createNotificationAdmin,
	getAllNotification,
	updateNotificationPin,
	updateReadNotification
} from '../services/notification.service';

export const GetAllNotification = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const notifications = await getAllNotification(req.user, req.query as { type: string[] });
		updateReadNotification(req.user);
		res.status(200).json(notifications);
	} catch (err) {
		next(err);
	}
};

export const CreateNotification = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		await createNotificationAdmin(req.body);
		res.sendStatus(200);
	} catch (err) {
		next(err);
	}
};

export const UpdatePin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		await updateNotificationPin(req.params.id, req.user);
		res.sendStatus(201);
	} catch (err) {
		next(err);
	}
};
