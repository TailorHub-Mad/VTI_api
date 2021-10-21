/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NEW_TEST_SYSTEM, TESTSYTEMS_NOTIFICATION } from '@constants/notification.constants';
import { Request, Response, NextFunction } from 'express';
import { createNotification, extendNotification } from '../services/notification.service';
import {
	createTestSystem,
	updateTestSystem,
	groupTestSystem,
	deleteTestSystem
} from '../services/test_system.service';

export const CreateTestSystem = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { body, user } = req;
		const testSystemId = await createTestSystem(body);
		const notification = await createNotification(user, {
			description: `Se ha creado un nuevo sitema de ensayo ${TESTSYTEMS_NOTIFICATION.label}`,
			urls: [
				{
					label: body.alias || TESTSYTEMS_NOTIFICATION.label,
					model: TESTSYTEMS_NOTIFICATION.model,
					id: testSystemId!
				}
			],
			type: NEW_TEST_SYSTEM
		});
		await extendNotification(
			{ field: TESTSYTEMS_NOTIFICATION.model, id: testSystemId! },
			notification,
			true
		);
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

export const DeleteTestSystem = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { user } = req;
		const { id_testSystem } = req.params;
		await deleteTestSystem(id_testSystem);
		logger.notice(
			`El usuario ${user.email} ha eliminado un sistema de ensayo con el id ${id_testSystem}`
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
