import { Request, Response, NextFunction } from 'express';
import { searchModelCar, searchModelCarCahce } from 'src/services/test.service';

export const FindModelCarTest = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const models = await searchModelCar(req.body);
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
