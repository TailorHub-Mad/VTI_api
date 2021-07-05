import { Request, Response, NextFunction } from 'express';
import { createProject, orderProject, updateProject } from '../services/project.service';

export const CreateProject = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { body } = req;
		await createProject(body);
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
		const { body, params } = req;
		await updateProject(params.id_project as string, body);
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
