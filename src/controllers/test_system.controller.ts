import { Request, Response, NextFunction } from 'express';
import {
	createTestSystem,
	updateTestSystem,
	groupTestSystem
} from '../services/test_system.service';

export const CreateTestSystem = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { body, user } = req;
		await createTestSystem(body);
		logger.notice(
			`El usuario ${user.email} ha creado un sistema de ensayo con el alias ${body.alias}`
		);
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
		const { body, params, user } = req;
		await updateTestSystem(params.id_testSystem as string, body);
		logger.notice(
			`El usuario ${user.email} ha modificado un sistema de ensayo con el alias ${params.id_testSystem}`
		);
		res.sendStatus(200);
	} catch (err) {
		next(err);
	}
};

export const GroupTestSystem = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const testSystem = await groupTestSystem(req.query);
		res.json(testSystem);
	} catch (err) {
		next(err);
	}
};
