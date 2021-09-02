import { NotFoundError } from '@errors/not_found.error';
import { getPagination } from '@utils/controllers.utils';
import { Request, Response, NextFunction } from 'express';
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
