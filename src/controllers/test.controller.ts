import { Request, Response, NextFunction } from 'express';
import { findTestSystem } from 'src/repositories/client.repository';
import { searchModelCar, searchModelCarCahce } from '../services/test.service';

export const FindModelCarTest = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const models = await findTestSystem(req.body);
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
