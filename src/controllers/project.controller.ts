/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NEW_PROJECT, PROJECTS_NOTIFICATION } from '@constants/notification.constants';
import { Request, Response, NextFunction } from 'express';
import { createNotification, extendNotification } from '../services/notification.service';
import {
	createProject,
	deleteProject,
	orderProject,
	updateProject
} from '../services/project.service';

export const CreateProject = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { body, user } = req;
		const id = await createProject(body);
		const notification = await createNotification(user, {
			description: `Se ha creado un nuevo mensaje en el ${PROJECTS_NOTIFICATION.label}`,
			urls: [
				{
					label: PROJECTS_NOTIFICATION.label,
					model: PROJECTS_NOTIFICATION.model,
					id: id!
				}
			],
			type: NEW_PROJECT
		});
		await extendNotification({ field: PROJECTS_NOTIFICATION.model, id: id! }, notification, true);
		logger.notice(`El usuario ${user.email} ha creado un proyecto con el alias ${body.alias}`);
		res.sendStatus(201);
	} catch (err) {
		next(err);
	}
};

export const UpdateProject = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { body, params, user } = req;
		await updateProject(params.id_project as string, body);
		logger.notice(
			`El usuario ${user.email} ha modificado un proyecto con el id ${params.id_project}`
		);
		res.sendStatus(200);
	} catch (err) {
		next(err);
	}
};

export const DeleteProject = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { user } = req;
		const { id_project } = req.params;
		await deleteProject(id_project);
		logger.notice(`El usuario ${user.email} ha eliminado un proyecto con el id ${id_project}`);
		res.sendStatus(200);
	} catch (err) {
		next(err);
	}
};

export const OrderProject = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const projects = await orderProject(req.query);
		res.json(projects);
	} catch (err) {
		next(err);
	}
};
