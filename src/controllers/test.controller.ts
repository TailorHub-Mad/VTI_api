import { Request, Response, NextFunction } from 'express';
import { findTestSystem } from '../repositories/client.repository';
import { searchModelCar, searchModelCarCahce } from '../services/test.service';

export const FindModelCarTest = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { offset = 0, limit = 0 } = req.query;
		const models = await findTestSystem(req.body, { offset: +offset, limit: +limit });
		res.json(models);
	} catch (err) {
		next(err);
	}
};

export const FindModelCarTestCache = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const models = await searchModelCarCahce(req.body);
		res.json(models);
	} catch (err) {
		next(err);
	}
};
