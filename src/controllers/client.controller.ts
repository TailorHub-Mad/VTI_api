import { getPagination } from '@utils/controllers.utils';
import { Request, Response, NextFunction } from 'express';
import { filterClient } from '../services/client.service';

export const FilterClient = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const pagination = getPagination(req.query);
		const clients = await filterClient(req.query, pagination);
		res.status(200).json(clients);
	} catch (err) {
		next(err);
	}
};
