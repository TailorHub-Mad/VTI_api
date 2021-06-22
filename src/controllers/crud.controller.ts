import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { create, getAll, getAllAggregate } from '../services/crud.service';
import { getPagination } from '../utils/controllers.utils';
import { GenericModel } from 'src/interfaces/models.interface';

// Creamos un controlador genérico usando una interface T que tendrá el valor del modelo que nosotros le pasemos.
export const GetAll =
	<Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
		model: M
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const pagination = getPagination(req.query);
			const result = await getAll<Doc, M>(model, pagination);
			res.status(200).json(result);
		} catch (err) {
			logger.error(`Error get all ${model.collection.name}`);
			next(err);
		}
	};

export const Create =
	<Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
		model: M,
		validate: Joi.ObjectSchema<Partial<Doc>>
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { body } = req;
			await create<Doc, M>(model, validate, body);
			res.sendStatus(201);
		} catch (err) {
			logger.error(`Error get all ${model.collection.name}`);
			next(err);
		}
	};

export const GetAllAggregate =
	(field?: string): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const pagination = getPagination(req.query);
			const result = await getAllAggregate(pagination, field);
			res.json(result);
		} catch (err) {
			next(err);
		}
	};
