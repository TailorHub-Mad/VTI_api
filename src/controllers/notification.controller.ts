import { Request, Response, NextFunction } from 'express';
import { getAllNotification, updateReadNotification } from '../services/notification.service';

export const GetAllNotification = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const notifications = await getAllNotification(req.user);
		updateReadNotification(req.user);
		res.status(200).json(notifications);
	} catch (err) {
		next(err);
	}
};
