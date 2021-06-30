import { Request, Response, NextFunction } from 'express';
import { createTestSystem, updateTestSystem } from '../services/test_system.service';

export const CreateTestSystem = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { body } = req;
		await createTestSystem(body);
		res.sendStatus(201);
	} catch (err) {
		next(err);
	}
};

export const UpdateTestSystem = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { body, params } = req;
		await updateTestSystem(params.id_testSystem as string, body);
		res.sendStatus(200);
	} catch (err) {
		next(err);
	}
};
