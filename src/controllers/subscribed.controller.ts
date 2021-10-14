import {
	SUBSCRIBED_NOTE,
	SUBSCRIBED_PROJECT,
	SUBSCRIBED_TESTSYSTEM
} from '@constants/subscribed.constanst';
import { Request, Response, NextFunction } from 'express';
import { UserModel } from 'src/models/user.model';

export const GetAllSubscribed = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const users = await UserModel.aggregate([
			...SUBSCRIBED_PROJECT,
			...SUBSCRIBED_TESTSYSTEM,
			...SUBSCRIBED_NOTE
		]);
		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
};
