import { Request, Response, NextFunction } from 'express';
import { createProject, orderProject, updateProject } from '../services/project.service';

export const CreateProject = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { body, user } = req;
		await createProject(body);
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
