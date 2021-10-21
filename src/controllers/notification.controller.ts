import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model';
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
		const notifications = await getAllNotification(
			req.user,
			req.query as { type: string[]; pin: string; date: string }
		);
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
		res.sendStatus(201);
	} catch (err) {
		next(err);
	}
};

export const UpdatePin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		await updateNotificationPin(req.params.id, req.user);
		res.sendStatus(200);
	} catch (err) {
		next(err);
	}
};

export const DeleteNotification = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const user = await UserModel.findOne({ _id: req.user.id });
		if (user) {
			const notificationIndex = user.notifications.findIndex(
				(notification) => notification.notification.toString() === req.params.id
			);
			user.notifications[notificationIndex].status =
				user.notifications[notificationIndex].status === 'disabled' ? 'read' : 'disabled';
			user.save();
		}
		res.sendStatus(200);
	} catch (err) {
		next(err);
	}
};
